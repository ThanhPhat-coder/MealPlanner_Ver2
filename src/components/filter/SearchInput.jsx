export default function SearchInput({ onSearch }) {
    return (
        <input type="text" placeholder="Search..." onChange={e => onSearch(e.target.value)} />
    );
}
