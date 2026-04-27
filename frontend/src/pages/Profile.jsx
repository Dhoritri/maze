import { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import axios from "axios";
import { toast } from "react-toastify";

const StatCard = ({ label, value }) => (
  <div className="border border-white/5 px-6 py-5 flex flex-col gap-1">
    <p className="text-2xl font-medium text-white">{value}</p>
    <p className="text-[10px] tracking-[0.18em] text-neutral-600 uppercase">{label}</p>
  </div>
);

const Profile = () => {
  const { backendUrl, token, navigate } = useContext(ShopContext);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const [editName, setEditName] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [saving, setSaving] = useState(false);
  const [showPasswordFields, setShowPasswordFields] = useState(false);

  useEffect(() => {
    if (!token) { navigate("/login"); return; }
    axios.get(backendUrl + "/api/user/profile", { headers: { token } })
      .then(({ data }) => {
        if (data.success) {
          setProfile(data.profile);
          setEditName(data.profile.name);
        } else {
          toast.error(data.message);
        }
      })
      .catch(() => toast.error("Failed to load profile"))
      .finally(() => setLoading(false));
  }, [token]);

  const handleSave = async (e) => {
    e.preventDefault();
    if (showPasswordFields) {
      if (newPassword !== confirmPassword) { toast.error("Passwords don't match"); return; }
      if (newPassword && newPassword.length < 6) { toast.error("Password must be at least 6 characters"); return; }
    }
    setSaving(true);
    try {
      const payload = { name: editName };
      if (showPasswordFields && newPassword) {
        payload.currentPassword = currentPassword;
        payload.newPassword = newPassword;
      }
      const { data } = await axios.post(backendUrl + "/api/user/profile", payload, { headers: { token } });
      if (data.success) {
        toast.success("Profile updated");
        setProfile((p) => ({ ...p, name: data.name }));
        setCurrentPassword(""); setNewPassword(""); setConfirmPassword("");
        setShowPasswordFields(false);
      } else {
        toast.error(data.message);
      }
    } catch {
      toast.error("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="min-h-[60vh]" />;
  if (!profile) return null;

  const initials = profile.name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2);
  const joinedDate = new Date(profile.joinedAt).toLocaleDateString("en-US", { month: "long", year: "numeric" });

  return (
    <div className="pt-10 pb-24 max-w-2xl">

      {/* Header */}
      <div className="flex items-center gap-5 mb-10 pb-10 border-b border-white/5">
        <div className="w-16 h-16 bg-[#FAB29E]/10 border border-[#FAB29E]/20 flex items-center justify-center flex-shrink-0">
          <span className="text-xl font-medium text-[#FAB29E]">{initials}</span>
        </div>
        <div>
          <h1 className="text-xl font-medium text-white">{profile.name}</h1>
          <p className="text-sm text-neutral-500 mt-0.5">{profile.email}</p>
          <p className="text-[10px] text-neutral-700 mt-1 tracking-wide">Member since {joinedDate}</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-px bg-white/5 mb-12">
        <StatCard label="Orders" value={profile.orderCount} />
        <StatCard label="Total Spent" value={`${profile.totalSpent}/-`} />
        <StatCard label="Reviews" value={profile.reviewCount} />
      </div>

      {/* Edit form */}
      <div>
        <p className="text-[10px] tracking-[0.2em] text-neutral-600 uppercase mb-6">Account Details</p>
        <form onSubmit={handleSave} className="flex flex-col gap-5">

          {/* Name */}
          <div>
            <label className="text-[10px] tracking-[0.15em] text-neutral-500 uppercase mb-2 block">Display Name</label>
            <input
              type="text"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              required
              className="w-full bg-transparent border border-white/8 text-white text-sm py-2.5 px-3 placeholder:text-neutral-700 focus:border-white/25 focus:outline-none transition-colors"
            />
          </div>

          {/* Email (read-only) */}
          <div>
            <label className="text-[10px] tracking-[0.15em] text-neutral-500 uppercase mb-2 block">Email</label>
            <input
              type="email"
              value={profile.email}
              readOnly
              className="w-full bg-transparent border border-white/5 text-neutral-600 text-sm py-2.5 px-3 cursor-default select-none"
            />
          </div>

          {/* Password toggle */}
          {!profile.isGoogleUser && (
            <div>
              <button
                type="button"
                onClick={() => setShowPasswordFields((v) => !v)}
                className="text-[10px] tracking-[0.15em] text-neutral-600 hover:text-[#FAB29E] transition-colors uppercase flex items-center gap-2"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                  className={`transition-transform ${showPasswordFields ? "rotate-180" : ""}`}>
                  <polyline points="6 9 12 15 18 9"/>
                </svg>
                {showPasswordFields ? "Cancel password change" : "Change password"}
              </button>

              {showPasswordFields && (
                <div className="mt-4 flex flex-col gap-4 border-l border-white/5 pl-4">
                  <div>
                    <label className="text-[10px] tracking-[0.15em] text-neutral-500 uppercase mb-2 block">Current Password</label>
                    <input
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-transparent border border-white/8 text-white text-sm py-2.5 px-3 placeholder:text-neutral-700 focus:border-white/25 focus:outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] tracking-[0.15em] text-neutral-500 uppercase mb-2 block">New Password</label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-transparent border border-white/8 text-white text-sm py-2.5 px-3 placeholder:text-neutral-700 focus:border-white/25 focus:outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] tracking-[0.15em] text-neutral-500 uppercase mb-2 block">Confirm New Password</label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-transparent border border-white/8 text-white text-sm py-2.5 px-3 placeholder:text-neutral-700 focus:border-white/25 focus:outline-none transition-colors"
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="pt-2 flex items-center gap-4">
            <button
              type="submit"
              disabled={saving}
              className="bg-white text-black px-8 py-3 text-[11px] tracking-[0.2em] font-medium hover:bg-[#FAB29E] transition-colors disabled:opacity-50"
            >
              {saving ? "SAVING..." : "SAVE CHANGES"}
            </button>
            <button
              type="button"
              onClick={() => navigate("/orders")}
              className="text-[11px] tracking-[0.15em] text-neutral-600 hover:text-white transition-colors"
            >
              View All Orders →
            </button>
          </div>

        </form>
      </div>

    </div>
  );
};

export default Profile;
