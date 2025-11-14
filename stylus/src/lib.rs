#![no_std]
extern crate alloc;

use stylus_sdk::{
    alloy_primitives::{Address, U256},
    prelude::*,
    storage::{StorageMap, StorageU256, StorageVec},
    vm,
};

use alloc::{string::String, vec::Vec};

sol_storage! {
    // Your storage struct
    pub struct DigitalInheritance {
        pub counter: StorageU256,
        pub inheritances: StorageMap<U256, Inheritance>,
        pub owner_to_ids: StorageMap<Address, StorageVec<U256>>,
        pub successor_to_ids: StorageMap<Address, StorageVec<U256>>,
    }

    #[derive(Clone, Default, SolValue)]
    pub struct Inheritance {
        pub owner: Address,
        pub successor: Address,
        pub ipfs_hash: String,
        pub tag: String,
        pub file_name: String,
        pub file_size: U256,
        pub timestamp: U256,
        pub is_active: bool,
        pub is_claimed: bool,
    }
}

// The router contract, which operates on DigitalInheritance storage
pub struct Contract;

/// Declare this is the contract entrypoint
#[external]
impl Router<DigitalInheritance> for Contract {
    fn create_inheritance(
        world: &mut DigitalInheritance,
        ctx: &Context,
        successor: Address,
        ipfs_hash: String,
        tag: String,
        file_name: String,
        file_size: U256,
    ) -> Result<U256, Vec<u8>> {
        let sender = ctx.sender();

        if successor == Address::ZERO || successor == sender {
            return Err(b"Invalid successor".to_vec());
        }

        if ipfs_hash.is_empty() || tag.is_empty() || file_name.is_empty() {
            return Err(b"Required fields cannot be empty".to_vec());
        }

        let id = *world.counter.get();
        world.counter.set(&(id + U256::from(1)));

        let record = Inheritance {
            owner: sender,
            successor,
            ipfs_hash,
            tag,
            file_name,
            file_size,
            timestamp: ctx.timestamp(),
            is_active: true,
            is_claimed: false,
        };

        world.inheritances.insert(id, record);
        world.owner_to_ids.entry(sender).or_default().push(id);
        world.successor_to_ids.entry(successor).or_default().push(id);

        Ok(id)
    }

    fn claim_inheritance(
        world: &mut DigitalInheritance,
        ctx: &Context,
        inheritance_id: U256,
    ) -> Result<(), Vec<u8>> {
        let sender = ctx.sender();
        let mut record = world.inheritances.get(inheritance_id)
            .ok_or(b"Not found".to_vec())?;

        if !record.is_active {
            return Err(b"Not active".to_vec());
        }

        if record.is_claimed {
            return Err(b"Already claimed".to_vec());
        }

        if record.successor != sender {
            return Err(b"Unauthorized".to_vec());
        }

        record.is_claimed = true;
        world.inheritances.insert(inheritance_id, record);

        Ok(())
    }

    fn revoke_inheritance(
        world: &mut DigitalInheritance,
        ctx: &Context,
        inheritance_id: U256,
    ) -> Result<(), Vec<u8>> {
        let sender = ctx.sender();
        let mut record = world.inheritances.get(inheritance_id)
            .ok_or(b"Not found".to_vec())?;

        if record.owner != sender {
            return Err(b"Unauthorized".to_vec());
        }

        if !record.is_active || record.is_claimed {
            return Err(b"Cannot revoke".to_vec());
        }

        record.is_active = false;
        world.inheritances.insert(inheritance_id, record);

        Ok(())
    }

    fn get_inheritance(
        world: &DigitalInheritance,
        _ctx: &Context,
        inheritance_id: U256,
    ) -> Option<Inheritance> {
        world.inheritances.get(inheritance_id)
    }

    fn get_owner_inheritances(
        world: &DigitalInheritance,
        _ctx: &Context,
        owner: Address,
    ) -> Vec<U256> {
        world.owner_to_ids.get(owner).map(|vec| vec.to_vec()).unwrap_or_default()
    }

    fn get_successor_inheritances(
        world: &DigitalInheritance,
        _ctx: &Context,
        successor: Address,
    ) -> Vec<U256> {
        world.successor_to_ids.get(successor).map(|vec| vec.to_vec()).unwrap_or_default()
    }

    fn can_access_inheritance(
        world: &DigitalInheritance,
