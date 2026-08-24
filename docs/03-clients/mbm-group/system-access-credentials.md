---
sidebar_position: 2
title: System Access & Credentials
---

# MBM-GROUP — System Access & Credentials

> **Policy:** no real passwords, keys, or tokens are ever committed to this repository (private or not) — git history is forever. Real access lives exclusively in the Proton Pass shared vault + the physical/USB backup described below.

## Break-Glass Recovery Plan

**Owner:** Boris Novák. Procedure for a designated person in case I lose the ability to manage MBM Group's IT infrastructure and client data.

### Phase 1 — Password access (Proton Pass)

All access lives in the shared vault **"Recovery - MBM - Group"** in **Proton Pass**.

- The designated person has their own Proton account, which the vault is shared with (login credentials for that Proton account are kept by the designated person outside this document).
- Sign in at [pass.proton.me](https://pass.proton.me) or the mobile/desktop app.
- **Fallback plan:** the Recovery Phrase for the Proton account is physically printed + on a USB key, stored in the Trezor.

### Phase 2 — Microsoft 365 break-glass account

In the vault, the entry **"Microsoft 365 núdzový účet"** (M365 emergency account) contains the login email, password, and TOTP (2FA) generator for the M365 break-glass admin account for MBM Group.

### Phase 3 — Taking control

1. [admin.microsoft.com](https://admin.microsoft.com) → sign in with the break-glass account → 2FA code from the Proton Pass entry.
2. The account has **Global Administrator** rights. Possible next steps:
   - full access to all client documents and intranet SharePoint sites,
   - reset password / disable 2FA on the regular admin account,
   - create new admins to keep the infrastructure running,
   - export contracts/data for handover.

The full procedure (including the actual credentials) is stored outside this repository — physically in the Trezor together with the Recovery Phrase and USB key.
