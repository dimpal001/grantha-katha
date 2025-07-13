<script lang="ts">
  import { navigateTo } from '$lib/navigation'
  import Input from '../components/Input.svelte'
  import Button from '../components/Button.svelte'
  import SuccessBox from '../components/SuccessBox.svelte'
  import ErrorBox from '../components/ErrorBox.svelte'
  import {
    sendOtp,
    verifyOtpAndUpdatePassword,
  } from '../../../events/authEvents'

  let step = 1
  let email = ''
  let otp = ''
  let password = ''
  let confirmPassword = ''
  let error = ''
  let success = ''
  let submitting = false

  async function handleSendOtp() {
    error = ''
    success = ''
    submitting = true

    if (!email.trim()) {
      error = 'Email is required'
      submitting = false
      return
    }

    try {
      const data = await sendOtp(email)
      console.log(data)

      if (data.err) {
        error = data.result || 'Failed to send OTP'
      } else {
        success = 'OTP sent to your email'
        step = 2
      }
    } catch (err) {
      error = 'Failed to send OTP. Please try again.'
    } finally {
      submitting = false
    }
  }

  async function resetPassword() {
    error = ''
    success = ''
    submitting = true

    if (!otp.trim()) {
      error = 'OTP is required'
      submitting = false
      return
    }

    if (!password.trim()) {
      error = 'Password is required'
      submitting = false
      return
    }

    if (password.length < 6) {
      error = 'Password must be at least 6 characters'
      submitting = false
      return
    }

    if (password !== confirmPassword) {
      error = 'Passwords do not match'
      submitting = false
      return
    }

    try {
      const data = await verifyOtpAndUpdatePassword(email, otp, password)

      if (data.err) {
        error = data.result || 'Failed to reset password'
      } else {
        success = 'Password reset successfully'
        navigateTo('login')
      }
    } catch (err) {
      error = 'Something went wrong. Please try again.'
    } finally {
      submitting = false
    }
  }
</script>

<div
  class="min-h-screen flex flex-col items-center justify-center p-6 dark:bg-slate-900 bg-gray-50"
>
  <div class="text-center mb-6">
    <h1 class="text-3xl font-bold text-black/80 dark:text-white">
      Forgot Password
    </h1>
    <p class="text-black/60 dark:text-gray-300 mt-2">
      Reset your password to regain access to your account.
    </p>
  </div>

  <div class="flex justify-center mb-4">
    <img
      src="/logo.png"
      alt="Registration Illustration"
      class="w-[45%] max-w-xs my-0"
    />
  </div>

  <div class="w-full px-2 max-w-md space-y-2">
    {#if step === 1}
      <Input
        placeholder="Email"
        value={email}
        onInput={(val) => (email = val)}
      />
      {#if success}
        <SuccessBox {success} />
      {/if}
      {#if error}
        <ErrorBox {error} />
      {/if}
      <Button label="Send OTP" onClick={handleSendOtp} isLoading={submitting} />
    {/if}

    {#if step === 2}
      <Input placeholder="OTP" value={otp} onInput={(val) => (otp = val)} />
      <Input
        placeholder="New Password"
        type="password"
        value={password}
        onInput={(val) => (password = val)}
      />
      <Input
        placeholder="Confirm Password"
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
        label="Reset Password"
        onClick={resetPassword}
        isLoading={submitting}
      />
    {/if}
  </div>

  <p class="mt-3 mb-10 text-sm text-center text-gray-600 dark:text-white/70">
    Remember your password?
    <button
      class="text-[#6257a5] font-semibold cursor-pointer hover:underline"
      on:click={() => navigateTo('login')}
    >
      Login
    </button>
  </p>
</div>
