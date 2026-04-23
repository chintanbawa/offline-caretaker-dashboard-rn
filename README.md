# Offline-First React Native Caretaker Dashboard

A production-minded offline-first mobile app built with Expo and React Native that acts as a local operator console for a nearby edge device.

This project is designed for environments where internet access cannot be assumed. The app remains useful offline, stores important operational data locally, connects to a nearby device over local Wi-Fi, supports BLE-based local device discovery and bootstrap, queues write actions when the device is unavailable, retries them later, and records a local audit trail of operator actions.

## Related Repositories

This mobile app works with two separate companion projects:

**Device Simulator Repo:** `https://github.com/chintanbawa/offline-caretaker-dashboard-simulator`

**BLE Peripheral Helper Repo:** `https://github.com/chintanbawa/offline-caretaker-dashboard-ble-peripheral`

The simulator acts as the nearby edge device over local Wi-Fi and exposes API endpoints used by this app for:

* health checks
* device status
* logs
* backups
* commands
* package deployment

The BLE peripheral helper acts as a nearby Bluetooth LE device used for:

* BLE discovery
* device bootstrap
* sharing local device metadata
* sharing the simulator base URL with the mobile app

These are intentionally separate projects to preserve realistic boundaries between:

* the mobile client
* the nearby BLE bootstrap device
* the nearby HTTP edge service

## Problem Statement

Many local edge-control, robotics-adjacent, and field-operation workflows cannot depend on stable internet access. In those cases, a mobile operator tool must still:

* remain usable offline
* preserve last known state locally
* handle device unavailability cleanly
* avoid losing user-triggered actions
* provide a durable audit trail
* discover nearby devices without requiring manual network setup every time

This project simulates that scenario with a local-first React Native application connected to a nearby device simulator over Wi-Fi, with optional BLE-based device discovery and bootstrap.

## Features

* Offline-first mobile dashboard
* SQLite-backed local persistence
* Last known device snapshot available without internet
* Local log viewer with filters
* Backup ledger view
* Local audit trail
* Manual local device URL configuration
* BLE discovery screen for nearby edge devices
* BLE bootstrap flow to fetch and save local device connection info
* Connection test and on-demand sync
* Durable mutation queue for:

  * `SEND_COMMAND`
  * `DEPLOY_PACKAGE`
* Retry handling for queued write actions
* Simplified package signing flow
* JSON package import for deploy payloads

## Tech Stack

* Expo / React Native
* TypeScript
* Expo Router
* Zustand
* expo-sqlite
* expo-document-picker
* expo-file-system
* expo-secure-store
* expo-crypto
* react-native-ble-plx

## Architecture

### Offline-first local state

The app uses local SQLite persistence as the durable source of truth for operator-visible data. UI screens load from local storage first and remain usable even when the nearby device is unreachable.

### Local network device communication

The mobile app talks to a nearby local device simulator over Wi-Fi using a manually configured base URL such as:

`http://192.168.x.x:3000`

### BLE bootstrap flow

The app also supports a BLE discovery and bootstrap flow for nearby edge devices.

BLE is used for:

* scanning and discovering nearby devices
* reading lightweight device metadata
* reading a bootstrap payload that contains the local Wi-Fi API base URL

BLE is **not** used as the primary transport for logs, backups, queued actions, or package deployment. Once the app receives the bootstrap payload, it continues normal operations over local Wi-Fi HTTP.

### Mutation queue

Only write actions are queued in v1:

* `SEND_COMMAND`
* `DEPLOY_PACKAGE`

Read operations are not queued. Failed reads can be retried manually, but failed writes must be preserved durably.

### Audit trail

Important app and sync actions are written to a local audit trail, including:

* connection tests
* sync start, success, and failure
* queue add, process, retry, failure, and success
* command submit attempts
* deploy submit attempts
* BLE scan and bootstrap events
* validation errors

### Simplified signing model

Deploy signing is intentionally simplified. The goal is to demonstrate validation and integrity boundaries, not to claim hardened production-grade package security.

## Project Structure

```text
app/
components/
db/
features/
services/
store/
types/
```

## Setup

### 1. Clone this repository

```bash
git clone https://github.com/chintanbawa/offline-caretaker-dashboard-rn
cd offline-caretaker-dashboard-rn
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env.local` file in the project root with the following variable:

```bash
EXPO_PUBLIC_SIGNING_SEED=use-secure-seed-text-here
```

This seed is used for the simplified package signing flow during local development.

### 4. Build and run the Expo app

Because BLE support requires native code, this app must be run using a development build instead of Expo Go.

```bash
npx expo prebuild
npx expo run:android
```

You can also use your normal Expo development workflow after creating the native build setup.

### 5. Start the companion device simulator

Clone and run the simulator from the separate repository:

`https://github.com/chintanbawa/offline-caretaker-dashboard-simulator`

### 6. Start the companion BLE peripheral helper

Clone and run the BLE peripheral helper from the separate repository:

`https://github.com/chintanbawa/offline-caretaker-dashboard-ble-peripheral`

### 7. Configure or bootstrap the mobile app

You can connect the app in either of these ways:

#### Option A: manual setup

In the Settings screen, save the simulator base URL, for example:

`http://192.168.1.10:3000`

Then:

* Test Connection
* Sync Now

#### Option B: BLE bootstrap

Open the BLE Discovery screen and:

* scan for nearby BLE devices
* connect to the nearby helper
* read the bootstrap payload
* save the returned base URL automatically

Then:

* Test Connection
* Sync Now

## BLE Bootstrap Flow

1. Start the BLE peripheral helper on your Mac
2. Start the device simulator on the same local network
3. Open the mobile app
4. Go to BLE Discovery
5. Scan for the nearby BLE helper
6. Connect and read:

   * device info
   * network bootstrap payload
7. Save the returned Wi-Fi base URL into the app
8. Continue normal sync and operator actions over local Wi-Fi HTTP

## Demo Flow

1. Start the device simulator on the same local network
2. Start the BLE peripheral helper
3. Launch the mobile app
4. Use BLE Discovery to bootstrap the device URL
5. Test local connection
6. Sync device status, logs, and backups
7. Stop the simulator
8. Queue a command or deploy action
9. Restart the simulator
10. Retry pending queue actions
11. Review the audit trail

## Why the simulator and BLE helper are in separate repos

The simulator and BLE helper are intentionally kept separate from the mobile app because they represent different runtimes and responsibilities.

This separation makes the project more realistic:

* the mobile app behaves like a real client
* the BLE helper behaves like a nearby discovery/bootstrap peripheral
* the simulator behaves like a nearby local API service
* the transport boundaries are explicit
* the simulator can later move to a Raspberry Pi or another edge box without changing the mobile app architecture

## Limitations

* Wi-Fi remains the primary transport in v1
* BLE is used only for discovery and bootstrap in the current implementation
* No cloud backend
* No multi-user support
* No background task processing
* Signing is simplified
* Simulator replaces real hardware integration
* BLE helper is a local development helper, not a production device runtime
* Not intended to claim enterprise-grade security

## Related Links

* Mobile App Repo: `https://github.com/chintanbawa/offline-caretaker-dashboard-rn`
* Device Simulator Repo: `https://github.com/chintanbawa/offline-caretaker-dashboard-simulator`
* BLE Peripheral Helper Repo: `https://github.com/chintanbawa/offline-caretaker-dashboard-ble-peripheral`
