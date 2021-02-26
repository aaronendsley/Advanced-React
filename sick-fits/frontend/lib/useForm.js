import { useEffect } from 'react';
import { useState } from 'react';

export function useForm(initial = {}) {
  // create a state object fro our inputs
  const [inputs, setInputs] = useState(initial);
  const initialValues = Object.values(initial).join('');

  useEffect(() => {
    //this function runs when the things we are watching change
    setInputs(initial);
  }, [initialValues]);

  function handleChange(e) {
    let { value, name, type } = e.target;
    if (type === 'number') {
      value = parseInt(value);
    }
    if (type === 'file') {
      [value] = e.target.files;
    }
    setInputs({
      ...inputs,
      [name]: value,
    });
  }

  function resetForm() {
    setInputs(initial);
  }

  function clearForm() {
    const blankState = Object.fromEntries(Object.entries(inputs).map(([key, value]) => [key, '']));
    console.log(blankState);
    setInputs(blankState);
  }

  // return the things we want surfaced from the custom hook

  return {
    inputs,
    handleChange,
    resetForm,
    clearForm,
  };
}
