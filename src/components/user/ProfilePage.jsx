import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../auth/AuthContext';
import ProfileForm from './ProfileForm';
// import ProfileSummary from './ProfileSummary';

export default function ProfilePage() {
    const { user, updateUser } = useContext(AuthContext);
    const [recipes, setRecipes] = useState([]);
    const [profile, setProfile] = useState(() =>
        JSON.parse(localStorage.getItem('profile_' + user?.email)) || {
            dietary: '',
            picture: user?.profilePic || '',
            fullname: user?.username || '',
        }
    );

    useEffect(() => {
        fetch('https://my-json-server-d36m.onrender.com/recipes')
            .then(res => res.json())
            .then(data => setRecipes(data))
            .catch(() => {
                const fallback = JSON.parse(localStorage.getItem('recipes')) || [];
                setRecipes(fallback);
                alert('⚠️ Lỗi kết nối. Dữ liệu tải từ localStorage.');
            });
    }, []);

    const created = recipes.filter(r => r.authorEmail === user?.email);
    const favorites = recipes.filter(r => r.favoritedBy === user?.email);

    const handleProfileUpdate = (newData) => {
        const updated = { ...profile, ...newData };
        setProfile(updated);
        localStorage.setItem('profile_' + user.email, JSON.stringify(updated));

        // ✅ Cập nhật AuthContext nếu có thay đổi avatar hoặc tên
        if (newData.picture || newData.fullname) {
            const updates = {};
            if (newData.picture) updates.profilePic = newData.picture;
            if (newData.fullname) updates.username = newData.fullname;
            updateUser(updates);
        }
    };

    return (
        <div>
            <ProfileForm profile={profile} onUpdate={handleProfileUpdate} />
            {/* <ProfileSummary created={created} favorites={favorites} /> */}
        </div>
    );
}
