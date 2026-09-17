import React, { useState } from 'react';
import { ArrowLeft, KeyRound, ShieldCheck } from 'lucide-react';

type Mode = 'reset' | 'change';
type Props = { mode: Mode; onBack: () => void; };

const passwordHint = 'At least 12 characters with uppercase, lowercase, number and symbol.';

export const PasswordManagementPage: React.FC<Props> = ({ mode, onBack }) => {
  const [resetToken, setResetToken] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setMessage('');
    setError('');
    if (newPassword !== confirmPassword) {
      setError('The new passwords do not match.');
      return;
    }
    setSaving(true);
    try {
      const authenticated = mode === 'change';
      const response = await fetch(`/api/admin/${authenticated ? 'change-password' : 'reset-password'}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(authenticated ? { 'x-admin-token': sessionStorage.getItem('adalAdminToken') || '' } : {}),
        },
        body: JSON.stringify(authenticated ? { currentPassword, newPassword } : { resetToken: resetToken.trim(), newPassword }),
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok || !result.success) throw new Error(result.message || 'Password operation failed.');
      setMessage(result.message || 'Password updated successfully.');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      if (authenticated) {
        sessionStorage.removeItem('adalAdminToken');
        setTimeout(() => { window.location.hash = '#admin'; }, 900);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Password operation failed.');
    } finally {
      setSaving(false);
    }
  };

  return <section className="min-h-[75vh] bg-slate-950 px-4 py-16 flex items-center">
    <div className="w-full max-w-md mx-auto rounded-3xl bg-white p-8 shadow-2xl">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-900 text-orange-400"><KeyRound /></div>
      <h1 className="mt-5 text-center text-2xl font-black">{mode === 'reset' ? 'Reset Admin Password' : 'Change Admin Password'}</h1>
      <p className="mt-2 text-center text-sm text-slate-500">{mode === 'reset' ? 'Use the private reset token configured in Render to recover access.' : 'Confirm your current password before choosing a new one.'}</p>
      <form onSubmit={submit} className="mt-8 space-y-4">
        {mode === 'reset' ? <input value={resetToken} onChange={e => setResetToken(e.target.value)} type="password" placeholder="Admin reset token" className="field" required /> : <input value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} type="password" placeholder="Current password" className="field" required />}
        <input value={newPassword} onChange={e => setNewPassword(e.target.value)} type="password" placeholder="New password" className="field" minLength={12} required />
        <input value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} type="password" placeholder="Confirm new password" className="field" minLength={12} required />
        <p className="text-xs leading-relaxed text-slate-500">{passwordHint}</p>
        {error && <p className="rounded-xl bg-rose-50 p-3 text-sm text-rose-700">{error}</p>}
        {message && <p className="rounded-xl bg-emerald-50 p-3 text-sm text-emerald-700">{message}</p>}
        <button disabled={saving} className="w-full rounded-xl bg-slate-900 py-3 font-black text-white disabled:opacity-50">{saving ? 'Saving…' : mode === 'reset' ? 'Reset password' : 'Change password'}</button>
      </form>
      <button onClick={onBack} className="mt-4 flex w-full items-center justify-center gap-2 text-xs font-bold text-slate-500"><ArrowLeft className="h-4 w-4"/> Back to admin login</button>
      <div className="mt-6 flex items-center justify-center gap-2 text-[11px] font-bold text-slate-400"><ShieldCheck className="h-4 w-4"/> Passwords are securely hashed on the server.</div>
    </div>
  </section>;
};
