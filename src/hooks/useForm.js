import useLocalState from '../utils/localState';

export default function useForm(key, { initialValues }) {
    const [values, setValues] = useLocalState(key, initialValues || {});

    const handleChange = event => {
        const value = event.target.value;
        const name = event.target.name;
        setValues({
            ...values,
            [name]: value
        });
    };
    return {
        values,
        handleChange
    }
}