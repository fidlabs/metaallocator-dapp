# On-ramp Contract Management Guide [MetaAllocator dApp]

This document is a guide on how to use **On-ramp contract related UI** in  
➡️ [contracts-admin.allocator.tech](https://contracts-admin.allocator.tech/)

---

## Table of Contents

- [Foreword about addresses](#foreword-about-addresses)
  - [Adding On-ramp contract address](#adding-on-ramp-contract-address)
  - [Adding On-ramp client address](#adding-on-ramp-client-address)
- [Foreword about access control](#foreword-about-access-control)
- [Adjusting initial rate limits](#adjusting-initial-rate-limits)
- [Pausing / unpausing On-ramp contract](#pausing--unpausing-on-ramp-contract)
- [Increasing / decreasing Client’s allowance](#increasing--decreasing-clients-allowance)
- [Locking / unlocking client](#locking--unlocking-client)
- [Changing Client’s rate limits](#changing-clients-rate-limits)
- [Adding allowed Storage Providers for Client](#adding-allowed-storage-providers-for-client)
- [Removing allowed Storage Provider from a Client](#removing-allowed-storage-provider-from-a-client)
- [Setting Client’s max deviation from fair distribution](#setting-clients-max-deviation-from-fair-distribution)

---

## Foreword about addresses

At the time of writing this document, there is no indexer that gathers on-ramp contract addresses. Additionally, the On-ramp/Client contract does not allow listing client addresses.

For this reason, the **MetaAllocator dApp** introduces an **Address Book** feature.  
The Address Book requires manually entering addresses for on-ramp contracts and clients, but once entered, they will be preserved between sessions using the browser’s local storage.  
The Address Book supports both **ETH** and **Filecoin** addresses.

---

### Adding On-ramp contract address

1. Go to [contracts-admin.allocator.tech](https://contracts-admin.allocator.tech/)
2. Enter on-ramp contract address in the **“Address”** field on widget titled **“Select OnRamp Contract”**
3. (Optional) Enter a name you would like to associate with that on-ramp contract
4. Press **“Add address”** button

---

### Adding On-ramp client address

1. Select previously added on-ramp contract from the Address Book
2. Enter on-ramp client address in the **“Address”** field on widget titled **“Select Client to manage”**
3. (Optional) Enter a name you would like to associate with that client
4. Press **“Add address”** button

---

## Foreword about access control

On-ramp contracts use **roles** to control access to contract methods.

Two key roles:

- `ROLE: MANAGER`
- `ROLE: ALLOCATOR`

Depending on which role you have, your access to certain functionalities in the UI may be limited.

Before attempting to interact with the on-ramp contract, ensure that you are connected with an account that has the appropriate role, or is a signer of a **Safe account** that holds that role.

---

## Adjusting initial rate limits

**ROLE: MANAGER**

1. Select previously added on-ramp contract from the address book
2. Find widget titled **“Manage initial rate limits”**
3. Enter new value in the **“Initial window size in blocks”** field
4. Enter new value in the **“Initial limit per window”** field
5. Press **“Update Rate Limits”** button
6. Confirm transaction in your wallet

📽️ Video:

- [update_rate_limits.mov](https://github.com/user-attachments/assets/de29dd1f-452d-4c5b-9355-10ff40514529)

---

## Pausing / unpausing On-ramp contract

**ROLE: MANAGER**

1. Select previously added on-ramp contract from the address book
2. Find the widget showing the pause status of contract (text: “Contract is not paused” / “Contract is paused”)
3. Press **“Pause”** button to pause if not paused, or **“Unpause”** button to unpause
4. Confirm transactions in your wallet

📽️ Videos:

- [pausing_contract.mov](https://github.com/user-attachments/assets/497b452c-8ad5-4807-9940-0c7ab5f57dc1)
- [unpausing_contract.mov](https://github.com/user-attachments/assets/a4188dd9-48fc-4a07-ba9a-349deb9c631d)

---

## Increasing / decreasing Client’s allowance

**ROLE: MANAGER / ALLOCATOR**

1. Select previously added on-ramp contract from the address book
2. Select previously added client address for that contract from the address book
3. Look for a widget showing current Client allowance and a form titled **“Manage Allowance”**
4. Select either **“Increase by”** or **“Decrease by”**
5. Enter the amount
6. Press **“Increase allowance”** / **“Decrease allowance”**
7. Confirm transactions in your wallet

📽️ Video:

- [increase_client_allowance.mov](https://github.com/user-attachments/assets/7a41dca6-026b-47fd-b561-4bb4674ca637)

---

## Locking / unlocking client

**ROLE: MANAGER**

1. Select previously added on-ramp contract from the address book
2. Select previously added client address for that contract from the address book
3. Find a widget showing current status of a client (“Client is not locked” / “Client is locked”)
4. (Optional) When locking, enter an amount of allowance to subtract. Leave empty or `0` for none.
5. Press **“Lock”** button if client is not locked, otherwise press **“Unlock”**
6. Confirm transactions in your wallet

📽️ Videos:

- [locking_client.mov](https://github.com/user-attachments/assets/2289a3e4-2ffa-41f7-adb4-26c2d04533ea)
- [unlocking_client.mov](https://github.com/user-attachments/assets/5641f21d-d90f-4be3-b20e-591fd511971c)

---

## Changing Client’s rate limits

**ROLE: MANAGER**

1. Select previously added on-ramp contract from the address book
2. Select previously added client address for that contract from the address book
3. Find widget titled **“Manage initial rate limits”**
4. Follow steps 3–6 from [Adjusting initial rate limits](#adjusting-initial-rate-limits)

📽️ Video:

- [changing_client_rate_limit.mov](https://github.com/user-attachments/assets/f38b032f-957f-42ca-bd9d-9d64b3118868)

---

## Adding allowed Storage Providers for Client

**ROLE: MANAGER / ALLOCATOR**

1. Select previously added on-ramp contract from the address book
2. Select client address for that contract
3. Find widget titled **“Manage Allowed SPs”**
4. Click the field **“Enter IDs to be added”**
5. Type in Storage Provider ID (with or without `f0` prefix)
6. Press Enter to confirm
7. Repeat for multiple IDs if needed
8. To remove a mistaken entry, click it
9. Press **“Save”** button
10. Confirm transactions in your wallet

📽️ Video:

- [adding_allowed_sps.mov](https://github.com/user-attachments/assets/20caa85e-5282-4e04-abcb-6a25c068a67e)

---

## Removing allowed Storage Provider from a Client

**ROLE: MANAGER / ALLOCATOR**

1. Select previously added on-ramp contract from the address book
2. Select client address for that contract
3. Find widget titled **“Manage Allowed SPs”**
4. From the list, click IDs you want to remove (they will turn red)
5. Select multiple IDs if needed
6. Click again to undo a mistake (red highlight disappears)
7. Press **“Save”** button
8. Confirm transactions in your wallet

📽️ Video:

- [removing_allowed_sps.mov](https://github.com/user-attachments/assets/3361c71f-5007-428b-b992-7b53f49f42d0)

---

## Setting Client’s max deviation from fair distribution

**ROLE: MANAGER / ALLOCATOR**

1. Select previously added on-ramp contract from the address book
2. Select client address for that contract
3. Find widget showing current max deviation (e.g. “Max Deviation: XX%”)
4. Use slider or input field to enter new value
5. Press **“Update”** button and confirm in your wallet

📽️ Video:

- [setting_client_max_deviation.mov](https://github.com/user-attachments/assets/898dff1c-53a8-4a9a-b73c-1d8d4a872871)

---

🔗 **MetaAllocator Admin dApp**: [contracts-admin.allocator.tech](https://contracts-admin.allocator.tech/)
