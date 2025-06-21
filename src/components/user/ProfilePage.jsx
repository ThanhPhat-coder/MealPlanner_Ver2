import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../auth/AuthContext';
import ProfileForm from './ProfileForm';
import ProfileSummary from './ProfileSummary';

export default function ProfilePage() {
    const { user } = useContext(AuthContext);
    const [recipes, setRecipes] = useState([]);
    const [profile, setProfile] = useState(() =>
        JSON.parse(localStorage.getItem('profile_' + user?.email)) || {
            dietary: '',
            picture: user?.profilePic || '', // fallback từ user nếu chưa lưu riêng
        }
    );

    useEffect(() => {
        fetch('http://localhost:3001/recipes')
            .then(res => res.json())
            .then(data => setRecipes(data))
            .catch(() => {
                const fallback = JSON.parse(localStorage.getItem('recipes')) || [];
                setRecipes(fallback);
                alert('⚠️ Lỗi kết nối. Dữ liệu tải từ localStorage.');
            });
    }, []);

    // ✅ Lọc các công thức đã tạo
    const created = recipes.filter(r => r.authorEmail === user?.email);

    // ✅ Lọc các công thức đã yêu thích bởi user hiện tại
    const favorites = recipes.filter(r => r.favoritedBy === user?.email);

    const handleProfileUpdate = (newData) => {
        const updated = { ...profile, ...newData };
        setProfile(updated);
        localStorage.setItem('profile_' + user.email, JSON.stringify(updated));
    };

    return (
        <div>
            {/* <h2>👤 Hồ sơ cá nhân</h2>
            <img
                src={profile.picture || 'https://via.placeholder.com/100'}
                alt="avatar"
                style={{ width: 100, height: 100, borderRadius: '50%', objectFit: 'cover', marginBottom: 10 }}
            />
            <p><strong>Email:</strong> {user?.email}</p> */}

            <ProfileForm profile={profile} onUpdate={handleProfileUpdate} />
            {/* <ProfileSummary created={created} favorites={favorites} /> */}
        </div>
    );
}
