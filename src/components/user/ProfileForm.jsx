import { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import {
    FaUser,
    FaLock,
    FaLeaf,
    FaPhone,
    FaCog,
    FaQuestionCircle,
    FaCamera,
    FaSave,
    FaEnvelope,
    FaBell,
    FaPen,
    FaUpload
} from 'react-icons/fa';
import 'react-toastify/dist/ReactToastify.css';
import './ProfileForm.css';

const menuItems = [
    { key: 'profile', label: 'Profile', icon: <FaUser /> },
    { key: 'security', label: 'Security', icon: <FaLock /> },
    { key: 'preferences', label: 'Preferences', icon: <FaLeaf /> },
    { key: 'phone', label: 'Phone', icon: <FaPhone /> },
    { key: 'settings', label: 'Settings', icon: <FaCog /> },
    { key: 'support', label: 'Support', icon: <FaQuestionCircle /> }
];

export default function ProfileForm({ profile = {}, onUpdate }) {
    const [activeTab, setActiveTab] = useState('profile');
    const [form, setForm] = useState(profile);
    const [localImage, setLocalImage] = useState('');

    const handleSave = (e) => {
        e.preventDefault();
        onUpdate?.(form);
        toast.success('✅ Profile saved successfully!');
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setLocalImage(reader.result);
                setForm({ ...form, picture: reader.result });
            };
            reader.readAsDataURL(file);
        }
    };

    const renderContent = () => {
        switch (activeTab) {
            case 'profile':
                return (
                    <div className="profile-row-horizontal">
                        <div className="profile-avatar-box">
                            <img
                                src={form.picture || localImage || 'https://via.placeholder.com/150'}
                                alt="avatar"
                                className="avatar-img"
                            />

                            <input
                                type="text"
                                placeholder="Image URL"
                                value={form.picture || ''}
                                onChange={(e) => setForm({ ...form, picture: e.target.value })}
                                className="avatar-url-input"
                            />

                            <label className="upload-button">
                                <FaUpload style={{ marginRight: '6px' }} />
                                Upload from device
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    style={{ display: 'none' }}
                                />
                            </label>
                        </div>

                        <div className="profile-info-box">
                            <div className="form-row">
                                <FaUser className="icon" />
                                <input
                                    type="text"
                                    placeholder="Full Name"
                                    value={form.fullname || ''}
                                    onChange={(e) =>
                                        setForm({ ...form, fullname: e.target.value })
                                    }
                                />
                            </div>

                            <div className="form-row">
                                <FaEnvelope className="icon" />
                                <input
                                    type="email"
                                    placeholder="Email"
                                    value={form.email || ''}
                                    onChange={(e) =>
                                        setForm({ ...form, email: e.target.value })
                                    }
                                />
                            </div>

                            <div className="form-row">
                                <FaPen className="icon" />
                                <textarea
                                    placeholder="Short bio..."
                                    value={form.bio || ''}
                                    onChange={(e) => setForm({ ...form, bio: e.target.value })}
                                />
                            </div>
                        </div>
                    </div>
                );

            case 'security':
                return (
                    <div className="form-row">
                        <FaLock className="icon" />
                        <input
                            type="password"
                            placeholder="New password"
                            onChange={(e) =>
                                setForm({ ...form, password: e.target.value })
                            }
                        />
                    </div>
                );

            case 'preferences':
                return (
                    <>
                        <div className="form-row">
                            <FaLeaf className="icon" />
                            <input
                                type="text"
                                placeholder="Dietary Preference"
                                value={form.dietary || ''}
                                onChange={(e) =>
                                    setForm({ ...form, dietary: e.target.value })
                                }
                            />
                        </div>
                        <div className="form-row toggle-row">
                            <FaBell className="icon" />
                            <label className="toggle-label">
                                Notifications
                                <input
                                    type="checkbox"
                                    checked={form.notifications || false}
                                    onChange={(e) =>
                                        setForm({ ...form, notifications: e.target.checked })
                                    }
                                />
                            </label>
                        </div>
                    </>
                );

            default:
                return <p style={{ color: '#666' }}>🚧 Coming Soon...</p>;
        }
    };

    return (
        <div className="profile-layout">
            <ToastContainer position="top-right" autoClose={2500} />

            <aside className="profile-sidebar">
                <h3>Settings</h3>
                <ul>
                    {menuItems.map((item) => (
                        <li
                            key={item.key}
                            className={activeTab === item.key ? 'active' : ''}
                            onClick={() => setActiveTab(item.key)}
                        >
                            {item.icon}
                            <span>{item.label}</span>
                        </li>
                    ))}
                </ul>
            </aside>

            <form className="profile-content" onSubmit={handleSave}>
                <h2>{menuItems.find((m) => m.key === activeTab)?.label}</h2>
                {renderContent()}
                <button type="submit" className="save-button">
                    <FaSave /> Save Changes
                </button>
            </form>
        </div>
    );
}
