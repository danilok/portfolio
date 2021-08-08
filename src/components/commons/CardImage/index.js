import React from 'react';
import styled, { css } from 'styled-components';
import { PropTypes } from 'prop-types';
import breakpointsMedia from '../../../theme/utils/breakpointsMedia';
import Link from '../Link';

const CardImageWrapper = styled.div`
  width: 100%;
`;

const Image = styled.img`
  ${breakpointsMedia({
    xs: css`
      width: 288px;
      height: 177px;
    `,
    md: css`
      width: 286px;
      height: 390px;
    `,
  })}

  ${({ isHighlighted }) => {
    if (isHighlighted) {
      return breakpointsMedia({
        md: css`
          width: -webkit-fill-available;
          height: 318px;
        `,
      });
    }
    return '';
  }}
`;

export default function CardImage({
  src, url, isHighlighted, ...props
}) {
  return (
    <CardImageWrapper>
      <Link
        href={url}
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...props}
      >
        <Image
          src={`/api/image-generator?url=${url}`}
          isHighlighted={isHighlighted}
        />
      </Link>
    </CardImageWrapper>
  );
}

CardImage.propTypes = {
  src: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
  isHighlighted: PropTypes.bool,
};

CardImage.defaultProps = {
  isHighlighted: false,
};
