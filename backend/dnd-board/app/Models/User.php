<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = [
        'first_name',
        'last_name',
        'email',
        'password',
        'role',
        'google2fa_secret',
    ];

    protected $hidden = [
        'password',
        'remember_token',
        'google2fa_secret',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
    ];

    /* -------------------------------------------------------------------------- */
    /* RELACIONES DE BASE DE DATOS                                                */
    /* -------------------------------------------------------------------------- */

    public function characters()
    {
        return $this->hasMany(Character::class);
    }

    public function dmBoards()
    {
        return $this->hasMany(Board::class, 'dm_id');
    }
}
