<?php

namespace App\Http\Controllers\Api;

use app\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use Laravel\Socialite\Facades\Socialite;
use PragmaRX\Google2FA\Google2FA;
use App\Http\Resources\UserResource;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Log;
use App\Http\Resources\AuthResource;


class AuthController extends Controller
{

    /* -------------------------------------------------------------------------- /
    / 0. REGISTRO (Email/Password)                                               /
    / -------------------------------------------------------------------------- */

    public function register(Request $request)
    {
        $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed',
        ]);

        // 2. Creamos el usuario
        $user = User::create([
            'first_name' => $request->first_name,
            'last_name' => $request->last_name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => 'normal',
        ]);

        $token = $user->createToken('auth_token');

        $expirationMinutes = config('sanctum.expiration');

        $expiresAt = $expirationMinutes
            ? Carbon::now()->addMinutes($expirationMinutes)->toIso8601String()
            : null;

        return (new AuthResource($token))
            ->additional(['expiresAt' => $expiresAt])
            ->response()
            ->setStatusCode(201);
    }

    /* -------------------------------------------------------------------------- */
    /* 1. AUTENTICACIÓN ESTÁNDAR (Email/Pass) + Lógica 2FA                        */
    /* -------------------------------------------------------------------------- */

    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json([
                'message' => 'Las credenciales son incorrectas.',
            ], 401);
        }

        if ($user->google2fa_secret) {
            return response()->json([
                'message' => '2FA requerido',
                'require_2fa' => true,
                'temp_user_id' => $user->id
            ]);
        }

        $token = $user->createToken('auth_token');

        $expirationMinutes = config('sanctum.expiration');

        $expiresAt = $expirationMinutes
            ? Carbon::now()->addMinutes($expirationMinutes)->toIso8601String()
            : null;

        return (new AuthResource($token))->additional(['expiresAt' => $expiresAt]);
    }

    /* -------------------------------------------------------------------------- */
    /* 2. VERIFICACIÓN DE 2FA (Segunda fase del login)                            */
    /* -------------------------------------------------------------------------- */

    public function me(Request $request)
    {
        return new UserResource($request->user());
    }

    public function verify2fa(Request $request)
    {
        $request->validate([
            'user_id' => 'required|exists:users,id',
            'code' => 'required|string',
        ]);

        $user = User::find($request->user_id);
        $google2fa = new Google2FA();

        $valid = $google2fa->verifyKey($user->google2fa_secret, $request->code, 4);

        if ($valid) {
            $token = $user->createToken('auth_token');

            $expirationMinutes = config('sanctum.expiration');

            $expiresAt = $expirationMinutes
                ? Carbon::now()->addMinutes($expirationMinutes)->toIso8601String()
                : null;

            return (new AuthResource($token))->additional(['expiresAt' => $expiresAt]);
        }

        return response()->json(['message' => 'Código 2FA inválido'], 401);
    }

    /* -------------------------------------------------------------------------- */
    /* 3. CONFIGURACIÓN DE 2FA (Activar/Generar QR)                               */
    /* -------------------------------------------------------------------------- */

    public function generate2faSecret(Request $request)
    {
        $user = $request->user();

        if ($user->google2fa_secret) {
            return response()->json([
                'message' => 'El 2FA ya está activo en esta cuenta.',
                'already_enabled' => true
            ], 400);
        }

        $google2fa = new Google2FA();
        $secret = $google2fa->generateSecretKey();

        $qrCodeUrl = $google2fa->getQRCodeUrl(
            config('app.name'),
            $user->email,
            $secret
        );

        return response()->json([
            'secret' => $secret,
            'qr_code_url' => $qrCodeUrl
        ]);
    }

    public function enable2fa(Request $request)
    {
        $request->validate(['secret' => 'required', 'code' => 'required']);
        $user = $request->user();

        $google2fa = new Google2FA();
        $valid = $google2fa->verifyKey($request->secret, $request->code, 4);

        if ($valid) {
            $user->google2fa_secret = $request->secret;
            $user->save();

            return response()->json(['message' => '2FA activado correctamente']);
        }

        return response()->json(['message' => 'Código incorrecto. No se activó 2FA.'], 400);
    }

    /* -------------------------------------------------------------------------- */
    /* 4. SOCIALITE (Google, GitHub, etc.)                                        */
    /* -------------------------------------------------------------------------- */

    public function redirectToProvider($provider)
    {
        return Socialite::driver($provider)->stateless()->redirect();
    }

    public function handleProviderCallback($provider)
    {
        try {
            $socialUser = Socialite::driver($provider)->stateless()->user();

            $fullName = $socialUser->getName() ?? 'Usuario';
            $parts = explode(' ', $fullName);
            $firstName = $parts[0];
            $lastName = count($parts) > 1 ? implode(' ', array_slice($parts, 1)) : ' ';

            $user = User::firstOrCreate(
                ['email' => $socialUser->getEmail()],
                [
                    'first_name' => $firstName,
                    'last_name' => $lastName,
                    'password' => Hash::make(str()->random(24)),
                    'role' => 'normal',
                ]
            );

            $tokenInstance = $user->createToken('auth_token');

            $authData = (new AuthResource($tokenInstance))->resolve();

            $expiration = config('sanctum.expiration', 1440);
            $expiresAt = Carbon::now()->addMinutes($expiration)->toIso8601String();

            $finalResponse = [
                'data' => $authData,
                'expiresAt' => $expiresAt
            ];

            return redirect("http://localhost:4200/login?session=" . urlencode(json_encode($finalResponse)));

        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 401);
        }
    }

    /* -------------------------------------------------------------------------- */
    /* 5. LOGOUT                                                                  */
    /* -------------------------------------------------------------------------- */

    public function logout(Request $request)
    {
        $request->user()->tokens()->delete();
        return response()->json(['message' => 'Sesión cerrada']);
    }
}
