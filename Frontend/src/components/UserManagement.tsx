import { useEffect, useState, type FormEvent, type ReactNode } from 'react'
import {
  ChevronDownIcon,
  PencilIcon,
  PlusIcon,
  SearchIcon,
  TrashIcon,
  UserIcon,
  XIcon,
  CheckIcon,
  ShieldIcon,
} from '../constants/icons'
import { btnPrimaryClass, btnSecondaryClass, fieldClass, inputClass, panelClass, selectClass } from '../constants/theme'
import {
  createUser,
  deleteUser,
  fetchUsers,
  updateUser,
  updateUserApproval,
  type User,
} from '../services/user.service'
import { AppLayout } from './layout/AppLayout'
import { useAuth } from '../context/AuthContext'
import { useNotifications } from '../context/NotificationContext'

type UserForm = {
  email: string
  fullName: string
  role: 'admin' | 'user'
  isApproved: boolean
}

const emptyForm: UserForm = {
  email: '',
  fullName: '',
  role: 'user',
  isApproved: true,
}

export default function UserManagement() {
  const { user: currentUser } = useAuth()
  const { push } = useNotifications()
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [apiError, setApiError] = useState<string | null>(null)
  const [query, setQuery] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<UserForm>(emptyForm)

  useEffect(() => {
    loadUsers()
  }, [])

  const loadUsers = async () => {
    try {
      const data = await fetchUsers()
      setUsers(data)
    } catch (err: any) {
      setApiError(err.response?.data?.message || 'Failed to load users')
    } finally {
      setLoading(false)
    }
  }

  const filtered = users.filter((user) => {
    const q = query.trim().toLowerCase()
    return (
      !q ||
      user.email.toLowerCase().includes(q) ||
      user.fullName.toLowerCase().includes(q)
    )
  })

  const openAddModal = () => {
    setEditingId(null)
    setForm(emptyForm)
    setModalOpen(true)
  }

  const openEditModal = (user: User) => {
    setEditingId(user.id)
    setForm({
      email: user.email,
      fullName: user.fullName,
      role: user.role,
      isApproved: user.isApproved,
    })
    setModalOpen(true)
  }

  const closeModal = () => {
    setModalOpen(false)
    setEditingId(null)
    setForm(emptyForm)
  }

  const handleDelete = async (id: string) => {
    const target = users.find((u) => u.id === id)
    if (!confirm(`Are you sure you want to delete ${target?.fullName ?? 'this user'}?`)) return
    try {
      await deleteUser(id)
      setUsers((prev) => prev.filter((u) => u.id !== id))
      push({ type: 'info', category: 'new_user', title: 'User deleted', message: `"${target?.fullName ?? 'User'}" was removed from the system.` })
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Failed to delete user'
      push({ type: 'error', category: 'action_error', title: 'Delete failed', message: msg })
      alert(msg)
    }
  }

  const handleToggleApproval = async (id: string, currentStatus: boolean) => {
    const target = users.find((u) => u.id === id)
    try {
      const updated = await updateUserApproval(id, !currentStatus)
      setUsers((prev) => prev.map((u) => (u.id === id ? updated : u)))
      push({
        type: 'success',
        category: 'new_user',
        title: currentStatus ? 'User suspended' : 'User approved',
        message: `"${target?.fullName ?? 'User'}" is now ${!currentStatus ? 'approved and can log in' : 'pending and cannot log in'}.`,
      })
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Failed to update user approval'
      push({ type: 'error', category: 'action_error', title: 'Update failed', message: msg })
      alert(msg)
    }
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!form.email.trim() || !form.fullName.trim()) return

    const payload = {
      email: form.email.trim(),
      fullName: form.fullName.trim(),
      role: form.role,
      isApproved: form.isApproved,
    }

    try {
      if (editingId !== null) {
        const updated = await updateUser(editingId, payload)
        setUsers((prev) => prev.map((u) => (u.id === editingId ? updated : u)))
        push({ type: 'success', category: 'new_user', title: 'User updated', message: `"${payload.fullName}" details were updated.` })
      } else {
        const created = await createUser(payload)
        setUsers((prev) => [...prev, created])
        push({
          type: 'success',
          category: 'new_user',
          title: 'New user added',
          message: `"${payload.fullName}" (${payload.role}) was added${payload.isApproved ? ' and approved' : ' — pending approval'}.`,
        })
      }
      closeModal()
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Failed to save user'
      push({ type: 'error', category: 'action_error', title: 'Save failed', message: msg })
      alert(msg)
    }
  }

  if (currentUser?.role !== 'admin') {
    return (
      <AppLayout title="Access Denied" subtitle="You don't have permission to access this page.">
        <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
          <span className="flex size-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
            <ShieldIcon className="size-8" />
          </span>
          <p className="mt-5 text-base font-semibold text-[#0B2735]">Access Denied</p>
          <p className="mt-1 max-w-sm text-sm text-slate-500">
            Only administrators can access the user management page.
          </p>
        </div>
      </AppLayout>
    )
  }

  return (
    <AppLayout
      title="User Management"
      subtitle="Manage system users and their access permissions."
      searchPlaceholder="Search users by name or email..."
    >
      <section className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-[#0B2735]">Users</h2>
          <p className="mt-1 max-w-xl text-sm text-slate-500">
            Manage user accounts, roles, and approval status for the Zuba House system.
          </p>
        </div>
        <button type="button" className={btnPrimaryClass} onClick={openAddModal}>
          <PlusIcon className="size-4" />
          Add User
        </button>
      </section>

      {apiError ? (
        <p className="rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-700 ring-1 ring-rose-200">{apiError}</p>
      ) : null}

      <section className={`${panelClass} !p-4 sm:!p-5`}>
        <label className="relative block min-w-0 flex-1">
          <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-slate-400">
            <SearchIcon className="size-[1.125rem]" />
          </span>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search users..."
            className={inputClass}
          />
        </label>
      </section>

      <section className="overflow-hidden rounded-2xl bg-[#0B2735] p-5 shadow-[0_18px_48px_-12px_rgba(11,39,53,0.45)] ring-1 ring-[#0B2735]/80 sm:p-6">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-lg font-semibold text-white">System users</h3>
            <p className="mt-0.5 text-sm text-white/60">
              {users.length} {users.length === 1 ? 'user' : 'users'} in the system
            </p>
          </div>
          <button
            type="button"
            className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/15 sm:hidden"
            onClick={openAddModal}
          >
            <PlusIcon className="size-4" />
            Add User
          </button>
        </div>

        <article className="overflow-hidden rounded-xl bg-white shadow-[0_8px_30px_-8px_rgba(15,23,42,0.12)] ring-1 ring-slate-200/60">
          {loading ? (
            <p className="px-5 py-14 text-center text-sm text-slate-500">Loading users…</p>
          ) : users.length === 0 ? (
            <EmptyState onAdd={openAddModal} />
          ) : filtered.length === 0 ? (
            <p className="px-5 py-14 text-center text-sm text-slate-500">No users match your search.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[700px] border-collapse text-left text-sm">
                <thead className="sticky top-0 z-10 border-b border-slate-200/80 bg-slate-50/95 backdrop-blur-sm">
                  <tr>
                    <th className="w-[30%] px-5 py-3.5 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Name
                    </th>
                    <th className="w-[25%] px-4 py-3.5 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Email
                    </th>
                    <th className="w-[15%] px-4 py-3.5 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Role
                    </th>
                    <th className="w-[15%] px-4 py-3.5 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Status
                    </th>
                    <th className="w-[15%] px-4 py-3.5 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((user) => (
                    <tr
                      key={user.id}
                      className="border-b border-slate-100 transition-colors last:border-0 hover:bg-slate-50/80"
                    >
                      <td className="px-5 py-4 font-medium text-slate-800">{user.fullName}</td>
                      <td className="px-4 py-4 text-slate-600">{user.email}</td>
                      <td className="px-4 py-4">
                        <RoleBadge role={user.role} />
                      </td>
                      <td className="px-4 py-4">
                        <ApprovalBadge isApproved={user.isApproved} />
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center justify-end gap-1">
                          <ActionButton
                            label={`Toggle approval for ${user.fullName}`}
                            onClick={() => handleToggleApproval(user.id, user.isApproved)}
                          >
                            {user.isApproved ? (
                              <XIcon className="size-4" />
                            ) : (
                              <CheckIcon className="size-4" />
                            )}
                          </ActionButton>
                          <ActionButton label={`Edit ${user.fullName}`} onClick={() => openEditModal(user)}>
                            <PencilIcon className="size-4" />
                          </ActionButton>
                          {user.id !== currentUser?.id ? (
                            <ActionButton
                              label={`Delete ${user.fullName}`}
                              variant="danger"
                              onClick={() => handleDelete(user.id)}
                            >
                              <TrashIcon className="size-4" />
                            </ActionButton>
                          ) : null}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </article>
      </section>

      {modalOpen ? (
        <UserModal
          form={form}
          setForm={setForm}
          editing={editingId !== null}
          onClose={closeModal}
          onSubmit={handleSubmit}
        />
      ) : null}
    </AppLayout>
  )
}

function RoleBadge({ role }: { role: string }) {
  const isAdmin = role === 'admin'
  return (
    <span
      className={`inline-flex min-w-[4.5rem] justify-center rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${
        isAdmin
          ? 'bg-emerald-50 text-emerald-700 ring-emerald-200'
          : 'bg-slate-100 text-slate-700 ring-slate-200'
      }`}
    >
      {role}
    </span>
  )
}

function ApprovalBadge({ isApproved }: { isApproved: boolean }) {
  return (
    <span
      className={`inline-flex min-w-[4.5rem] justify-center rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${
        isApproved
          ? 'bg-emerald-50 text-emerald-700 ring-emerald-200'
          : 'bg-amber-50 text-amber-700 ring-amber-200'
      }`}
    >
      {isApproved ? 'Approved' : 'Pending'}
    </span>
  )
}

function ActionButton({
  children,
  label,
  onClick,
  variant = 'default',
}: {
  children: ReactNode
  label: string
  onClick: () => void
  variant?: 'default' | 'danger'
}) {
  const styles =
    variant === 'danger'
      ? 'text-slate-400 hover:bg-rose-50 hover:text-rose-600'
      : 'text-slate-400 hover:bg-slate-100 hover:text-[#0B2735]'
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className={`inline-flex size-8 items-center justify-center rounded-lg transition ${styles}`}
    >
      {children}
    </button>
  )
}

function EmptyState({ onAdd }: { onAdd: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
      <span className="flex size-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
        <UserIcon className="size-8" />
      </span>
      <p className="mt-5 text-base font-semibold text-[#0B2735]">No users added yet</p>
      <p className="mt-1 max-w-sm text-sm text-slate-500">
        Add users to the system and manage their roles and approval status.
      </p>
      <button type="button" className={`${btnPrimaryClass} mt-6`} onClick={onAdd}>
        <PlusIcon className="size-4" />
        Add User
      </button>
    </div>
  )
}

function UserModal({
  form,
  setForm,
  editing,
  onClose,
  onSubmit,
}: {
  form: UserForm
  setForm: (value: UserForm | ((prev: UserForm) => UserForm)) => void
  editing: boolean
  onClose: () => void
  onSubmit: (e: FormEvent) => void
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [onClose])

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center p-4 sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="user-modal-title"
    >
      <button
        type="button"
        className="absolute inset-0 bg-slate-900/45 backdrop-blur-sm"
        aria-label="Close dialog"
        onClick={onClose}
      />
      <div className="relative w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-[0_24px_64px_-16px_rgba(15,23,42,0.28)] ring-1 ring-slate-200/80">
        <div className="flex items-start justify-between gap-4 border-b border-slate-100 px-6 py-5">
          <div>
            <h2 id="user-modal-title" className="text-lg font-semibold text-[#0B2735]">
              {editing ? 'Edit user' : 'Add user'}
            </h2>
            <p className="mt-0.5 text-sm text-slate-500">
              {editing ? 'Update user details and permissions.' : 'Add a new user to the system.'}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex size-9 shrink-0 items-center justify-center rounded-xl text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
            aria-label="Close"
          >
            <XIcon className="size-5" />
          </button>
        </div>

        <form onSubmit={onSubmit} className="space-y-4 px-6 py-5">
          <FormField label="Full Name">
            <input
              required
              type="text"
              value={form.fullName}
              onChange={(e) => setForm((f) => ({ ...f, fullName: e.target.value }))}
              placeholder="e.g. John Doe"
              className={fieldClass}
            />
          </FormField>
          <FormField label="Email">
            <input
              required
              type="email"
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              placeholder="e.g. john@example.com"
              className={fieldClass}
            />
          </FormField>
          <FormField label="Role">
            <div className="relative">
              <select
                value={form.role}
                onChange={(e) => setForm((f) => ({ ...f, role: e.target.value as 'admin' | 'user' }))}
                className={`${selectClass} w-full appearance-none pr-10`}
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
              <ChevronDownIcon className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
            </div>
          </FormField>
          <FormField label="Approval Status">
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="approval"
                  checked={form.isApproved}
                  onChange={() => setForm((f) => ({ ...f, isApproved: true }))}
                  className="size-4 text-[#0B2735] focus:ring-[#0B2735]"
                />
                <span className="text-sm text-slate-700">Approved</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="approval"
                  checked={!form.isApproved}
                  onChange={() => setForm((f) => ({ ...f, isApproved: false }))}
                  className="size-4 text-[#0B2735] focus:ring-[#0B2735]"
                />
                <span className="text-sm text-slate-700">Pending</span>
              </label>
            </div>
          </FormField>

          <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">
            <button type="button" className={btnSecondaryClass} onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className={btnPrimaryClass}>
              {editing ? 'Save changes' : 'Add user'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

function FormField({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-slate-700">{label}</span>
      {children}
    </label>
  )
}
