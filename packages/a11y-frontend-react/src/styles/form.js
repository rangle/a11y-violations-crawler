import styled from 'styled-components';

const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const FormHeader = styled.h2`
  margin-bottom: 1.25rem;
  font-size: 1.5rem;
  line-height: 2rem;
`;

const FormButton = styled.button`
  padding: 0.75rem;
  max-width: 20rem;
  display: block;
  cursor: pointer;
  border-radius: 0.125rem;
  background-color: skyblue;
`;

const FormTextInput = styled.input`
  display: block;
  border: 1px solid skyblue;
  border-radius: 0.125rem;
  margin-top: 0.5rem;
  padding: 0.5rem;
`;

const FormFileInput = styled.input`
  display: block;
  border: 1px solid skyblue;
  border-radius: 0.125rem;
  margin-top: 0.5rem;
  padding: 0.5rem;
`;

const FormLabel = styled.label`
  margin-bottom: 1rem;
`;

const FormMessage = styled.p`
  margin: ${(props) => props.margin || '0'};
  color: ${(props) => props.textColour};
`;

export {
  FormContainer,
  FormHeader,
  FormButton,
  FormFileInput,
  FormTextInput,
  FormLabel,
  FormMessage,
};
