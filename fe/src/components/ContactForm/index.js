import { useState, useEffect } from 'react';
import propTypes from 'prop-types';

import { Form, ButtonContainer } from './styles';

import FormGroup from '../FormGroup';
import Input from '../Input';
import Select from '../Select';
import Button from '../Button';

import isEmailValid from '../../utils/isEmailValid';
import formatPhone from '../../utils/formatPhone';
import useErrors from '../../hooks/useErrors';
import CategoriesService from '../../services/CategoriesService';

export default function ContactForm({ buttonLabel }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [categories, setCategories] = useState([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);

  const {
    errors, setError, removeError, getErrorMessageByFieldName,
  } = useErrors();

  const isFormValid = (name && errors.length === 0);

  useEffect(() => {
    setIsLoadingCategories(true);

    async function loadCategories() {
      try {
        setIsLoadingCategories(true);

        const categoriesList = await CategoriesService.listCategories();

        setCategories(categoriesList);
      } catch { } finally {
        setIsLoadingCategories(false);
      }
    }

    loadCategories();
  }, []);

  function handleNameChange(event) {
    setName(event.target.value);

    if (!event.target.value) {
      setError({ field: 'name', message: 'Nome é obrigatório' });
    } else {
      removeError('name');
    }
  }

  function handleEmailChange(event) {
    setEmail(event.target.value);

    if (event.target.value && !isEmailValid(event.target.value)) {
      setError({ field: 'email', message: 'E-mail é inválido' });
    } else {
      removeError('email');
    }
  }

  function handlePhoneChange(event) {
    setPhone(formatPhone(event.target.value));
  }

  function handleSubmit(event) {
    event.preventDefault();
  }

  return (
    <Form onSubmit={handleSubmit} noValidate>
      <FormGroup error={getErrorMessageByFieldName('name')}>
        <Input
          value={name}
          placeholder="Nome *"
          onChange={handleNameChange}
          error={getErrorMessageByFieldName('name')}
        />
      </FormGroup>

      <FormGroup error={getErrorMessageByFieldName('email')}>
        <Input
          type="email"
          value={email}
          placeholder="E-mail"
          onChange={handleEmailChange}
          error={getErrorMessageByFieldName('email')}
        />
      </FormGroup>

      <FormGroup error={getErrorMessageByFieldName('phone')}>
        <Input
          value={formatPhone(phone)}
          placeholder="Telefone"
          onChange={handlePhoneChange}
          error={getErrorMessageByFieldName('phone')}
          maxLength="15"
        />
      </FormGroup>

      <FormGroup isLoading={isLoadingCategories}>
        <Select
          value={categoryId}
          onChange={(event) => setCategoryId(event.target.value)}
          disabled={isLoadingCategories}
        >
          <option value="">Sem categoria</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </Select>
      </FormGroup>

      <ButtonContainer>
        <Button
          type="submit"
          disabled={!isFormValid}
        >
          {buttonLabel}
        </Button>
      </ButtonContainer>
    </Form>
  );
}

ContactForm.propTypes = {
  buttonLabel: propTypes.string.isRequired,
};
