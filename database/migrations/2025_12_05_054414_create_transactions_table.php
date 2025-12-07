<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('transactions', function (Blueprint $table) {
            $table->id();
            $table->string('invoice_code')->unique();
            $table->string('customer_name');
            $table->string('customer_phone')->nullable();
            $table->decimal('total_amount', 12, 2);
            $table->enum('status', ['new', 'process', 'ready', 'taken'])->default('new');
            $table->string('rack_location')->nullable();

            // Cashless Info
            $table->enum('payment_status', ['unpaid', 'paid', 'failed'])->default('unpaid');
            $table->string('payment_method')->nullable();
            $table->string('snap_token')->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('transactions');
    }
};
