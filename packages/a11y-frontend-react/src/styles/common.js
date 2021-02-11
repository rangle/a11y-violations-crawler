import styled from 'styled-components';
import { Link } from 'react-router-dom';

const H2 = styled.h2`
  font-size: 1.5rem;
  line-height: 2rem;
`;

const SiteList = styled.ul`
  margin-top: 0.75rem;
`;

const ListItem = styled.li`
  line-height: 1.5rem;

  &:hover {
    text-decoration: underline;
  }
`;

const ResultContainer = styled.div`
  padding: 50px 15px;
`;

const BlueLink = styled(Link)`
  color: rgba(37, 99, 235, 1);
`;

const BlueExtLink = styled.a`
  color: rgba(37, 99, 235, 1);
`;

export { H2, SiteList, ListItem, ResultContainer, BlueLink, BlueExtLink };
