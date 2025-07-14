<script lang="ts">
  // @ts-nocheck
  import Input from '../components/Input.svelte'
  import Button from '../components/Button.svelte'
  import SuccessBox from '../components/SuccessBox.svelte'
  import ErrorBox from '../components/ErrorBox.svelte'
  import { updateName } from '../../../events/authEvents'
  import { useAuthUser } from '$lib/authUser'

  const user = useAuthUser()

  let currentName = user?.name || ''
  let newName = ''
  let error = ''
  let success = ''
  let submitting = false

  async function handleUpdateName() {
    submitting = true
    error = ''
    success = ''

    if (!newName.trim()) {
      error = 'Please enter a new name.'
      submitting = false
      return
    }

    if (newName.trim() === currentName.trim()) {
      error = 'New name must be different from current name.'
      submitting = false
      return
    }

    try {
      const response = await updateName(newName)

      if (response && !response.err) {
        success = response.result
        currentName = newName
        newName = ''
      } else {
        error = response?.result || 'Failed to update name.'
      }
    } catch (e) {
      error = 'An unexpected error occurred. Please try again.'
    } finally {
      submitting = false
    }
  }
</script>

<div
  class="min-h-screen flex flex-col items-center py-8 p-6 dark:bg-slate-900 bg-gray-50"
>
  <div class="w-full space-y-4">
    <div class="text-gray-800 dark:text-gray-200 text-sm">
      <span class="font-semibold">Current Name:</span>
      {currentName}
    </div>

    <Input
      placeholder="Enter new name"
      value={newName}
      onInput={(val) => (newName = val)}
    />

    {#if success}
      <SuccessBox {success} />
    {/if}
    {#if error}
      <ErrorBox {error} />
    {/if}

    <Button
      label="Update Name"
      onClick={handleUpdateName}
      isLoading={submitting}
    />
  </div>
</div>
