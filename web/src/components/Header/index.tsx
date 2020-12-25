import React from 'react';

import { Link } from 'react-router-dom';

import { Container } from './styles';

import Logo from '../../assets/logo.svg';

interface HeaderProps{
  size?: 'small' | 'large';
  menu: 'dashboard' | 'import';
}

const Header: React.FC<HeaderProps> = ({ size = 'large', menu = 'dashboard' }: HeaderProps) => (

  <Container size={size}>
    <header>
      <img src={Logo} alt="GoFinances"/>
      <nav>
        <Link to="/" className={menu === "dashboard" ? "active" : ""}>
          Dashboard
        </Link>
        <Link to="/import" className={menu === "import" ? "active" : ""}>
          Import
        </Link>
      </nav>
    </header>
  </Container>
)

export default Header;
