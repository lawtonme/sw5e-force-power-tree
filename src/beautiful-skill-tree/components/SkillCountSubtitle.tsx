import React, { useContext } from 'react';
import SkillContext from '../context/SkillContext';
import styled from 'styled-components';

function SkillCountSubtitle() {
  const { selectedCount } = useContext(SkillContext);

  return (
    <StyledSkillCountSubtitle>
      {selectedCount} skills selected
    </StyledSkillCountSubtitle>
  );
}

const StyledSkillCountSubtitle = styled.p`
  font-family: ${({ theme }) => theme.headingFont};
  margin-top: 0;
  text-align: center;
`;

export default SkillCountSubtitle;
