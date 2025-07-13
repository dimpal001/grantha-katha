<script lang="ts">
  import { navigateTo } from '$lib/navigation'
  import Input from '../components/Input.svelte'
  import Button from '../components/Button.svelte'
  import { login } from '../../../events/authEvents'
  import SuccessBox from '../components/SuccessBox.svelte'
  import ErrorBox from '../components/ErrorBox.svelte'
  import { authStore, currentUserStore } from '../../../stores/appStore'

  let email = ''
  let password = ''
  let error = ''
  let success = ''
  let submitting = false

  async function loginUser() {
    if (email && password) {
      submitting = true
      error = ''
      success = ''
      const response = await login({ email, password })
      if (response && !response.err) {
        success = 'Login Successfull'
        authStore.set(true)
        currentUserStore.set(response.result)
        localStorage.setItem('currentUser', JSON.stringify(response.result))
        navigateTo('home')
      } else {
        error = response.result || 'Unable to login'
      }
      submitting = false
    }
  }
</script>

<div
  class="min-h-screen flex flex-col items-center justify-center p-6 dark:bg-slate-900 bg-gray-50"
>
  <div class="text-center mb-6">
    <h1 class="text-3xl font-bold text-black/80 dark:text-white">
      Welcome Back!
    </h1>
    <p class="text-black/60 dark:text-gray-300 mt-2">
      Log in to access your dashboard and learning resources.
    </p>
  </div>

  <div class="flex justify-center mb-4">
    <img src="/logo.png" alt="Logo" class="w-[45%] max-w-xs my-0" />
  </div>

  <div class="w-full px-2 space-y-3">
    <Input placeholder="Email" value={email} onInput={(val) => (email = val)} />
    <Input
      placeholder="Password"
      type="password"
      value={password}
      onInput={(val) => (password = val)}
    />

    <div class="text-right">
      <button
        class="text-sm text-[#6257a5] font-semibold"
        on:click={() => navigateTo('forgotPassword')}
      >
        Forgot Password?
      </button>
    </div>

    {#if success}
      <SuccessBox {success} />
    {/if}
    {#if error}
      <ErrorBox {error} />
    {/if}

    <Button label="Login" onClick={loginUser} isLoading={submitting} />
  </div>

  <p class="mt-3 mb-10 text-sm text-center text-gray-600 dark:text-white/70">
    Don’t have an account?
    <button
      class="text-[#6257a5] font-semibold cursor-pointer hover:underline"
      on:click={() => navigateTo('register')}
    >
      Register
    </button>
  </p>
</div>
