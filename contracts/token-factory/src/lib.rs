#![no_std]
use soroban_sdk::{
    contract, contracterror, contractimpl, contracttype, symbol_short, Address, Env, String, Symbol, Vec,
};

#[contracterror]
#[derive(Copy, Clone, Debug, Eq, PartialEq, PartialOrd, Ord)]
#[repr(u32)]
pub enum Error {
    AlreadyInitialized = 1,
    NotInitialized = 2,
    Unauthorized = 3,
    InsufficientFee = 4,
    TokenNotFound = 5,
}

#[derive(Clone)]
#[contracttype]
pub enum DataKey {
    Admin,
    Treasury,
    BaseFee,
    MetadataFee,
    TokenRegistry,
    IsInitialized,
}

#[derive(Clone)]
#[contracttype]
pub struct FactoryState {
    pub admin: Address,
    pub treasury: Address,
    pub base_fee: i128,
    pub metadata_fee: i128,
}

#[contract]
pub struct TokenFactory;

#[contractimpl]
impl TokenFactory {
    /// Initialize the factory with admin, treasury, and fee structure.
    pub fn initialize(
        env: Env,
        admin: Address,
        treasury: Address,
        base_fee: i128,
        metadata_fee: i128,
    ) -> Result<(), Error> {
        if env.storage().instance().has(&DataKey::IsInitialized) {
            return Err(Error::AlreadyInitialized);
        }

        env.storage().instance().set(&DataKey::Admin, &admin);
        env.storage().instance().set(&DataKey::Treasury, &treasury);
        env.storage().instance().set(&DataKey::BaseFee, &base_fee);
        env.storage().instance().set(&DataKey::MetadataFee, &metadata_fee);
        env.storage().instance().set(&DataKey::IsInitialized, &true);
        env.storage().instance().set(&DataKey::TokenRegistry, &Vec::<Address>::new(&env));

        Ok(())
    }

    /// Deploy a new token with specified parameters.
    pub fn create_token(
        env: Env,
        creator: Address,
        name: String,
        symbol: String,
        decimals: u32,
        initial_supply: i128,
        fee_payment: i128,
    ) -> Result<Address, Error> {
        creator.require_auth();

        let base_fee: i128 = env.storage().instance().get(&DataKey::BaseFee).unwrap();
        if fee_payment < base_fee {
            return Err(Error::InsufficientFee);
        }

        // Transfer fee to treasury
        let treasury: Address = env.storage().instance().get(&DataKey::Treasury).unwrap();
        // (In a real implementation, you would use token_sdk to transfer XLM here)

        // Deploy the new token contract
        // (Simplified for this example)
        let token_address = env.current_contract_address(); // Replace with actual deployment logic
        
        // Add to registry
        let mut registry: Vec<Address> = env.storage().instance().get(&DataKey::TokenRegistry).unwrap();
        registry.push_back(token_address.clone());
        env.storage().instance().set(&DataKey::TokenRegistry, &registry);

        // Emit event
        env.events().publish(
            (symbol_short!("tok_reg"), token_address.clone()),
            (creator, name, symbol, decimals, initial_supply),
        );

        Ok(token_address)
    }

    /// Mint additional tokens (admin only).
    pub fn mint_tokens(
        env: Env,
        token_address: Address,
        admin: Address,
        to: Address,
        amount: i128,
        fee_payment: i128,
    ) -> Result<(), Error> {
        admin.require_auth();
        
        let factory_admin: Address = env.storage().instance().get(&DataKey::Admin).unwrap();
        if admin != factory_admin {
            return Err(Error::Unauthorized);
        }

        // Emit event (representing minting)
        env.events().publish(
            (symbol_short!("adm_mint"), token_address),
            (to, amount),
        );

        Ok(())
    }

    /// Burn tokens.
    pub fn burn(
        env: Env,
        token_address: Address,
        from: Address,
        amount: i128,
    ) -> Result<(), Error> {
        from.require_auth();

        // Emit event (representing burning)
        env.events().publish(
            (symbol_short!("tok_burn"), token_address),
            (from, amount),
        );

        Ok(())
    }

    /// Get current factory state.
    pub fn get_state(env: Env) -> Result<FactoryState, Error> {
        if !env.storage().instance().has(&DataKey::IsInitialized) {
            return Err(Error::NotInitialized);
        }

        Ok(FactoryState {
            admin: env.storage().instance().get(&DataKey::Admin).unwrap(),
            treasury: env.storage().instance().get(&DataKey::Treasury).unwrap(),
            base_fee: env.storage().instance().get(&DataKey::BaseFee).unwrap(),
            metadata_fee: env.storage().instance().get(&DataKey::MetadataFee).unwrap(),
        })
    }
}
