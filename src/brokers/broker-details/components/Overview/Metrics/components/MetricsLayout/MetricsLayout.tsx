import { FC, ReactElement } from 'react';
import { Grid, GridItem, PageSection, Title } from '@patternfly/react-core';
import { MetricsType } from '../../utils/types';
import { useTranslation } from '@app/i18n/i18n';

export type MetricsLayoutProps = {
  metricsMemoryUsage?: ReactElement;
  metricsCPUUsage?: ReactElement;
  metricsActions: ReactElement;
  metricsType: MetricsType;
};

export const MetricsLayout: FC<MetricsLayoutProps> = ({
  metricsMemoryUsage,
  metricsCPUUsage,
  metricsActions,
  metricsType,
}) => {
  const { t } = useTranslation();
  return (
    <PageSection
      hasOverflowScroll={true}
      aria-label="metrics"
      padding={{ default: 'noPadding' }}
      className={
        'pf-u-px-lg-on-xl pf-u-pt-sm-on-xl pf-u-pb-lg-on-xl pf-u-px-md pf-u-pb-md'
      }
    >
      <Title headingLevel="h2" className="pf-u-ml-sm pf-u-mb-md">
        {t('Metrics')}
      </Title>
      <Grid hasGutter>
        <GridItem>{metricsActions}</GridItem>
        {(() => {
          switch (true) {
            case metricsType === MetricsType.AllMetrics:
              return (
                <>
                  <GridItem sm={6}>{metricsMemoryUsage}</GridItem>
                  <GridItem sm={6}>{metricsCPUUsage}</GridItem>
                  {/* <GridItem sm={6}>{metricsMemoryUsage} </GridItem>
                <GridItem sm={6}>{metricsMemoryUsage} </GridItem> */}
                </>
              );
            case metricsType === MetricsType.MemoryUsage:
              return <GridItem>{metricsMemoryUsage}</GridItem>;
            case metricsType === MetricsType.CPUUsage:
              return <GridItem>{metricsCPUUsage}</GridItem>;
            default:
              return <></>;
          }
        })()}
      </Grid>
    </PageSection>
  );
};
