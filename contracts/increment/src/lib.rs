#![no_std]
use soroban_sdk::{contract, contractimpl, log, symbol_short, Env, Symbol};

const COUNTER: Symbol = symbol_short!("COUNTER");

#[contract]
pub struct IncrementContract;

#[contractimpl]
impl IncrementContract {
    /// Increment increments an internal counter, and returns the value.
    pub fn increment(env: Env) -> u32 {
        // Get the current count from instance storage (default to 0 if not set)
        let mut count: u32 = env.storage().instance().get(&COUNTER).unwrap_or(0);
        
        log!(&env, "current count: {}", count);
        
        // Increment the count
        count += 1;
        
        // Save the new count back to instance storage
        env.storage().instance().set(&COUNTER, &count);
        
        // Extend the lifetime of this storage entry
        env.storage().instance().extend_ttl(100, 100);
        
        // Publish an event for the increment
        env.events().publish(
            (symbol_short!("counter"), symbol_short!("increment")),
            count,
        );
        
        // Return the new count
        count
    }

    /// Get current counter value
    pub fn get_value(env: Env) -> u32 {
        env.storage().instance().get(&COUNTER).unwrap_or(0)
    }
}

mod test;
