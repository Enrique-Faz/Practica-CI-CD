<?php

namespace Tests\Feature;

// use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ExampleTest extends TestCase
{
    /**
     * A basic test example.
     */
    public function test_the_application_returns_a_successful_response(): void
    {
        $response = $this->postJson('/api/login', []);

        // La API responde (422 = validación fallida, no 404)
        $response->assertStatus(422);
    }
}
