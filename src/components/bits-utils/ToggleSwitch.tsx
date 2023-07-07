import BeatLoader from 'react-spinners/BeatLoader';

const ToggleSwitch = ({
    label,
    onChange,
    checked,
    loading,
}: {
    label?: string;
    onChange?: any;
    checked?: any;
    loading?: boolean;
}) => {
    return (
        <div className="container">
            {/* {label} */}
            {loading ? (
                <BeatLoader color="#2EAFA3" size={10} />
            ) : (
                <div className="toggle-switch">
                    <input
                        type="checkbox"
                        className="checkboxs"
                        name={label}
                        id={label}
                        onChange={onChange}
                        checked={checked}
                    />
                    <label className="label" htmlFor={label}>
                        <span className="inner" />
                        <span className="switch" />
                    </label>
                </div>
            )}
        </div>
    );
};

export default ToggleSwitch;
