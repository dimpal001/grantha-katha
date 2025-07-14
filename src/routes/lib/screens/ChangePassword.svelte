<script lang="ts">
  import Input from '../components/Input.svelte'
  import Button from '../components/Button.svelte'
  import SuccessBox from '../components/SuccessBox.svelte'
  import ErrorBox from '../components/ErrorBox.svelte'
  import { changePassword } from '../../../events/authEvents'

  let currentPassword = ''
  let newPassword = ''
  let confirmPassword = ''
  let error = ''
  let success = ''
  let submitting = false

  async function handleChangePassword() {
    submitting = true
    error = ''
    success = ''

    if (!currentPassword.trim()) {
      error = 'Current password is required'
      submitting = false
      return
    }

    if (!newPassword.trim()) {
      error = 'New password is required'
      submitting = false
      return
    }

    if (newPassword.length < 6) {
      error = 'New password must be at least 6 characters'
      submitting = false
      return
    }

    if (newPassword !== confirmPassword) {
      error = 'New password and confirm password do not match'
      submitting = false
      return
    }

    try {
      const response = await changePassword(currentPassword, newPassword)

      if (response && !response.err) {
        success = response?.result || 'Password changed successfully'
        currentPassword = ''
        newPassword = ''
        confirmPassword = ''
      } else {
        error = response?.result || 'Unable to change password'
      }
    } catch (err) {
      error = 'Something went wrong while changing password'
    } finally {
      submitting = false
    }
  }
</script>

<div
  class="min-h-screen flex flex-col items-center py-8 p-6 dark:bg-slate-900 bg-gray-50"
>
  <div class="w-full max-w-md space-y-3">
    <Input
      placeholder="Current Password"
      type="password"
      value={currentPassword}
      onInput={(val) => (currentPassword = val)}
    />
    <Input
      placeholder="New Password"
      type="password"
      value={newPassword}
      onInput={(val) => (newPassword = val)}
    />
    <Input
      placeholder="Confirm New Password"
      type="password"
      value={confirmPassword}
      onInput={(val) => (confirmPassword = val)}
    />

    {#if success}
      <SuccessBox {success} />
    {/if}
    {#if error}
      <ErrorBox {error} />
    {/if}

    <Button
      label="Change Password"
      onClick={handleChangePassword}
      isLoading={submitting}
    />
  </div>
</div>
