import styled from 'styled-components';

interface ContainerProps{
  size?: 'small' | 'large';
}

export const Container = styled.div<ContainerProps>`
  background: #5636d3;
  padding: 30px 0;

  header{
    max-width: 1120px;
    margin: 0 auto;
    padding: ${({ size }) => (size === 'small' ? '0 20px' : '0 20px 150px')};

    display: flex;
    align-items: center;
    justify-content: space-between;

    nav{
      a{
        color: #fff;
        text-decoration: none;
        font-size: 16px;
        transition: opacity 0.2s;
        font-weight: 500;
        opacity: 0.8;
        position: relative;

        &:after{
          content: "";
          bottom: -10px;
          height: 2px;
          background: #FF872C;
          left: 0px;
          position: absolute;
          width: 0px;
          transition: width 0.2s;
        }

        &.active{
          font-weight: 600;
          opacity: 1;

          &:after{
            width: 100%;
          }
        }

        & + a{
          margin-left: 32px;
        }

        &:hover{
          opacity: 0.6;
        }
      }
    }
  }
`;
