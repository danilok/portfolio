/* eslint-disable @next/next/no-img-element */
import React from 'react';
import PropTypes from 'prop-types';
import styled, { css } from 'styled-components';
import Grid from '../../foundation/layout/Grid';
import Box from '../../foundation/layout/Box';
import Text from '../../foundation/Text';
import TextField from '../../forms/TextField';
import TextareaField from '../../forms/TextareaField';
import CloseButton from '../../commons/CloseButton';
import breakpointsMedia from '../../../theme/utils/breakpointsMedia';
import errorAnimation from './animations/error.json';
import loadingAnimation from './animations/loading.json';
import successAnimation from './animations/success.json';
import FormFeedback from '../FormFeedback';

const Button = styled.div`
  border: 0px;
  cursor: pointer;
  margin: 10px 0;
  display: flex;
  align-items: center;
  text-transform: uppercase;
  background-color: inherit;

  &:hover,
  &:focus {
    opacity: .5;
  }

  &:disabled {
    cursor: not-allowed;
    opacity: .2;
  }
`;

const Form = styled.form`
  flex: 1;
  ${breakpointsMedia({
    xs: css`
      padding-top: 50px;
    `,
    md: css`
      padding-top: 0;
    `,
  })}
`;

function validateEmail(email) {
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

const formStates = {
  DEFAULT: 'DEFAULT',
  LOADING: 'LOADING',
  DONE: 'DONE',
  ERROR: 'ERROR',
};

function FormContent({ onClose }) {
  const [isFormSubmitted, setIsFormSubmitted] = React.useState(false);
  const [formState, setFormState] = React.useState(formStates.DEFAULT);
  const [contactMessageData, setContactMessageData] = React.useState({
    name: '',
    email: '',
    message: '',
  });

  function handleChange(event) {
    const fieldName = event.target.getAttribute('name');
    setContactMessageData({
      ...contactMessageData,
      [fieldName]: event.target.value,
    });
  }

  function resetForm() {
    setIsFormSubmitted(false);
    setFormState(formStates.DEFAULT);
    setContactMessageData({
      name: '',
      email: '',
      message: '',
    });
  }

  const anyEmptyFields = Object.values(contactMessageData)
    .reduce((valid, field) => (field.length === 0 ? true : valid), false);

  const validEmail = validateEmail(contactMessageData.email);

  const isFormInvalid = anyEmptyFields || !validEmail;

  return (
    <Form
      onSubmit={async (event) => {
        event.preventDefault();

        setIsFormSubmitted(true);

        const contactMessageDTO = {
          name: contactMessageData.name,
          email: contactMessageData.email,
          message: contactMessageData.message,
        };

        try {
          setFormState(formStates.LOADING);
          const respostaDoServidor = await fetch('https://contact-form-api-jamstack.herokuapp.com/message', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(contactMessageDTO),
          });
          if (!respostaDoServidor.ok) {
            throw Error('Não foi possível enviar a mensagem');
          }

          setTimeout(() => {
            setFormState(formStates.DONE);
          }, 1000);
        } catch (error) {
          // eslint-disable-next-line no-console
          setTimeout(() => {
            setFormState(formStates.ERROR);
          }, 1000);
        }
      }}
    >
      <CloseButton onClose={onClose} resetForm={resetForm} />

      <Text
        as="p"
        variant="contact"
        color="primary.main"
        textAlign="center"
        margin="0"
        textTransform="uppercase"
      >
        Envie sua mensagem
      </Text>
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="space-around"
        paddingTop={{
          xs: '24px',
          md: '30px',
        }}
        height={{
          xs: '72%',
          md: '75%',
        }}
      >
        <div>
          <Text
            as="label"
            variant="label"
            color="primary.main"
          >
            Seu nome
          </Text>
          <TextField
            id="name"
            placeholder="Fulano de tal"
            name="name"
            value={contactMessageData.name}
            onChange={handleChange}
          />
        </div>
        <div>
          <Text
            as="label"
            variant="label"
            color="primary.main"
          >
            Seu email
          </Text>
          <TextField
            placeholder="fulano@email.com"
            name="email"
            value={contactMessageData.email}
            onChange={handleChange}
          />
          {!validEmail && contactMessageData.email.length >= 0 && (
            <Text
              as="span"
              variant="smallestException"
              color="danger.main"
            >
              Email inválido
            </Text>
          )}
        </div>
        <div>
          <Text
            as="label"
            variant="label"
            color="primary.main"
          >
            Sua mensagem
          </Text>
          <TextareaField
            tag="textarea"
            placeholder="Escreva sua mensagem"
            name="message"
            value={contactMessageData.message}
            onChange={handleChange}
          />
        </div>
      </Box>
      {!isFormSubmitted && (
        <Box
          display="flex"
          flexDirection="row"
          justifyContent="center"
        >
          <Button
            as="button"
            type="submit"
            disabled={isFormInvalid}
          >
            <Text
              as="label"
              variant="label"
              color="primary.main"
              margin="0 10px 0 0"
            >
              Enviar
            </Text>
            <img alt="Entrar em contato" src="images/icons/send_button.svg" />
          </Button>
        </Box>
      )}

      {isFormSubmitted && formState === formStates.LOADING && (
        <FormFeedback
          width={{
            xs: '50px',
            md: '60px',
          }}
          height={{
            xs: '50px',
            md: '60px',
          }}
          animation={loadingAnimation}
        />
      )}

      {isFormSubmitted && formState === formStates.DONE && (
        <FormFeedback
          width={{
            xs: '70px',
            md: '80px',
          }}
          height={{
            xs: '60px',
            md: '80px',
          }}
          animation={successAnimation}
        />
      )}

      {isFormSubmitted && formState === formStates.ERROR && (
        <FormFeedback
          width={{
            xs: '70px',
            md: '80px',
          }}
          height={{
            xs: '60px',
            md: '80px',
          }}
          animation={errorAnimation}
        />
      )}
    </Form>
  );
}

FormContent.propTypes = {
  onClose: PropTypes.func.isRequired,
};

export default function ContactForm({ modalProps }) {
  const { boxAttributes, onClose } = modalProps;
  return (
    <Grid.Row
      marginLeft={0}
      marginRight={0}
      flex={1}
      justifyContent="center"
      alignItems="flex-end"
    >
      <Grid.Col
        display="flex"
        paddingRight={{
          xs: '18px',
          md: '0',
        }}
        paddingLeft={{
          xs: '18px',
          md: '0',
        }}
        flex={1}
        value={{
          xs: 12,
          md: 5,
          lg: 4,
        }}
      >
        <Box
          boxShadow="-10px 0px 24px rgba(7, 12, 14, 0.1)"
          display="flex"
          flexDirection="column"
          // justifyContent="center"
          paddingRight={{
            xs: '16px',
            md: '45px',
          }}
          paddingLeft={{
            xs: '16px',
            md: '45px',
          }}
          backgroundColor="white"
          height={{
            xs: '600px',
            md: '675px',
          }}
          width={{
            xs: '360px',
            md: '900px',
          }}
          // eslint-disable-next-line react/jsx-props-no-spreading
          {...boxAttributes}
        >
          <FormContent onClose={onClose} />
        </Box>
      </Grid.Col>
    </Grid.Row>
  );
}

ContactForm.propTypes = {
  modalProps: PropTypes.shape({
    boxAttributes: PropTypes.shape({
      'data-modal-safe-area': PropTypes.string.isRequired,
    }),
    onClose: PropTypes.func,
  }).isRequired,
};
