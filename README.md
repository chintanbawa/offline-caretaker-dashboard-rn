# Offline-First React Native Caretaker Dashboard

A production-minded offline-first mobile app built with Expo and React Native that acts as a local operator console for a nearby edge device.

This project is designed for environments where internet access cannot be assumed. The app remains useful offline, stores important operational data locally, connects to a nearby device over local Wi-Fi, queues write actions when the device is unavailable, retries them later, and records a local audit trail of operator actions.

## Related Repository

This mobile app works with a separate local device simulator project:

**Device Simulator Repo:** `https://github.com/chintanbawa/offline-caretaker-dashboard-simulator`

The simulator acts as the nearby edge device and exposes local API endpoints used by this app for:

* health checks
* device status
* logs
* backups
* commands
* package deployment

This repo intentionally keeps the mobile app and simulator separate to preserve realistic boundaries between the client and the local device service.

## Problem Statement

Many local edge-control, robotics-adjacent, and field-operation workflows cannot depend on stable internet access. In those cases, a mobile operator tool must still:

* remain usable offline
* preserve last known state locally
* handle device unavailability cleanly
* avoid losing user-triggered actions
* provide a durable audit trail

This project simulates that scenario with a local-first React Native application connected to a nearby device simulator over Wi-Fi.

## Features

* Offline-first mobile dashboard
* SQLite-backed local persistence
* Last known device snapshot available without internet
* Local log viewer with filters
* Backup ledger view
* Local audit trail
* Manual local device URL configuration
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

## Architecture

### Offline-first local state

The app uses local SQLite persistence as the durable source of truth for operator-visible data. UI screens load from local storage first and remain usable even when the nearby device is unreachable.

### Local network device communication

The mobile app talks to a nearby local device simulator over Wi-Fi using a manually configured base URL such as:

`http://192.168.x.x:3000`

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

### 4. Start the Expo app

```bash
npx expo start
```

### 5. Start the companion device simulator

Clone and run the simulator from the separate repository:

`https://github.com/chintanbawa/offline-caretaker-dashboard-simulator`

### 6. Configure the mobile app

In the Settings screen, save the simulator base URL, for example:

`http://192.168.1.10:3000`

Then:

* Test Connection
* Sync Now

## Demo Flow

1. Start the device simulator on the same local network
2. Launch the mobile app
3. Save the simulator base URL in Settings
4. Test local connection
5. Sync device status, logs, and backups
6. Stop the simulator
7. Queue a command or deploy action
8. Restart the simulator
9. Retry pending queue actions
10. Review the audit trail

## Why the simulator is in a separate repo

The device simulator is intentionally kept separate from the mobile app because it represents a different runtime and responsibility boundary.

This separation makes the project more realistic:

* the mobile app behaves like a real client
* the simulator behaves like a real nearby device service
* the HTTP contract is explicit
* the simulator can later move to a Raspberry Pi or another edge box without changing the mobile app architecture

## Limitations

* Wi-Fi only in v1
* No BLE
* No cloud backend
* No multi-user support
* No background task processing
* Signing is simplified
* Simulator replaces real hardware integration
* Not intended to claim enterprise-grade security

## Related Links

* Mobile App Repo: `https://github.com/chintanbawa/offline-caretaker-dashboard-rn`
* Device Simulator Repo: `https://github.com/chintanbawa/offline-caretaker-dashboard-simulator`

