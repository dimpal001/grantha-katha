<script lang="ts">
  import { navigateTo } from '$lib/navigation'
  import Input from '../components/Input.svelte'
  import Button from '../components/Button.svelte'
  import SuccessBox from '../components/SuccessBox.svelte'
  import ErrorBox from '../components/ErrorBox.svelte'
  import { authStore, currentUserStore } from '../../../stores/appStore'
  import { register } from '../../../events/authEvents'

  let name = ''
  let email = ''
  let password = ''
  let error = ''
  let success = ''
  let submitting = false

  async function registerUser() {
    submitting = true
    error = ''
    success = ''

    if (!name.trim()) {
      error = 'Name is required'
      submitting = false
      return
    }

    if (!email.trim()) {
      error = 'Email is required'
      submitting = false
      return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      error = 'Please enter a valid email address'
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

    try {
      const response = await register({ name, email, password })

      if (response && !response.err) {
        success = 'Registration Successful'
        navigateTo('login')
      } else {
        error = response.result || 'Unable to register'
      }
    } catch (err) {
      error = 'Something went wrong during registration'
    } finally {
      submitting = false
    }
  }
</script>

<div
  class="min-h-screen flex flex-col items-center justify-center p-6 dark:bg-slate-900 bg-gray-50"
>
  <div class="text-center mb-6">
    <h1 class="text-3xl font-bold text-slate-800 dark:text-white">
      Join Us Today!
    </h1>
    <p class="text-gray-600 dark:text-gray-300 mt-2">
      Create your account to access eBooks, audio books and more.
    </p>
  </div>

  <div class="flex justify-center mb-6">
    <img
      src="/logo.png"
      alt="Registration Illustration"
      class="w-3/6 max-w-xs my-2"
    />
  </div>

  <div class="w-full px-2 max-w-md space-y-3">
    <Input placeholder="Name" value={name} onInput={(val) => (name = val)} />
    <Input placeholder="Email" value={email} onInput={(val) => (email = val)} />
    <Input
      placeholder="Password"
      type="password"
      value={password}
      onInput={(val) => (password = val)}
    />

    {#if success}
      <SuccessBox {success} />
    {/if}
    {#if error}
      <ErrorBox {error} />
    {/if}

    <Button label="Register" onClick={registerUser} isLoading={submitting} />
  </div>

  <p class="mt-6 mb-10 text-sm text-center text-gray-600 dark:text-white/70">
    Already have an account?
    <button
      class="text-[#6257a5] font-semibold cursor-pointer hover:underline"
      on:click={() => navigateTo('login')}
    >
      Login
    </button>
  </p>
</div>
