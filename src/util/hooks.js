import { useState } from 'react';

export const useForm = (callback, initialSate = {}) => {
  const [values, setValues] = useState(initialSate);
  const onChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };
  const onSubmit = (e) => {
    e.preventDefault();
    callback();
  };
  return {
    onChange,
    onSubmit,
    values,
  };
};
