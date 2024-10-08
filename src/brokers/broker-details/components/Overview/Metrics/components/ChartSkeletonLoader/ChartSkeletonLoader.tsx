import { Flex, FlexItem, Skeleton } from '@patternfly/react-core';
import type { VoidFunctionComponent } from 'react';
import { chartHeight, chartPadding } from '@app/constants/constants';
import { useTranslation } from '@app/i18n/i18n';

export const ChartSkeletonLoader: VoidFunctionComponent = () => {
  const { t } = useTranslation();
  return (
    <Flex direction={{ default: 'column' }} data-chromatic="ignore">
      <FlexItem>
        <Skeleton
          height={`${chartHeight - chartPadding.bottom}px`}
          screenreaderText={t('Metrics data is loading')}
        />
      </FlexItem>
      <FlexItem>
        <Skeleton height={`${chartPadding.bottom / 2 - 12.5}px`} width="20%" />
      </FlexItem>
      <FlexItem>
        <Skeleton height={`${chartPadding.bottom / 2 - 12.5}px`} width="40%" />
      </FlexItem>
    </Flex>
  );
};
