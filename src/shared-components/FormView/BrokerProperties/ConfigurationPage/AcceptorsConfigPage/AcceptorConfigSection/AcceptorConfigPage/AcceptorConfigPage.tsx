import {
  Checkbox,
  FormFieldGroup,
  FormFieldGroupHeader,
  FormGroup,
  FormSelect,
  FormSelectOption,
  Grid,
  Switch,
  TextInput,
} from '@patternfly/react-core';
import {
  BrokerCreationFormDispatch,
  BrokerCreationFormState,
} from '@app/reducers/reducer';
import {
  ArtemisReducerOperations712,
  ExposeMode,
  getAcceptor,
  getConfigBindToAllInterfaces,
  getConfigFactoryClass,
  getConfigHost,
  getConfigPort,
  getConfigProtocols,
  getConfigSSLEnabled,
} from '@app/reducers/7.12/reducer';
import { FC, useContext } from 'react';
import { ConfigType } from '../../../ConfigurationPage';
import { useTranslation } from '@app/i18n/i18n';
import { PresetAlertPopover } from './PresetAlertPopover/PresetAlertPopover';
import { SelectExposeMode } from './SelectExposeMode/SelectExposeMode';
import { OtherParameters } from './OtherParameters/OtherParameters';
import { ListPresets } from './ListPresets/ListPresets';
import { CertSecretSelector } from '../../../CertSecretSelector/CertSecretSelector';

type AcceptorProps = {
  configName: string;
  configType: ConfigType;
};

//this is shared by acceptor config and connector config
export const AcceptorConfigPage: FC<AcceptorProps> = ({
  configName,
  configType,
}) => {
  const { cr } = useContext(BrokerCreationFormState);
  const dispatch = useContext(BrokerCreationFormDispatch);

  const selectedClass = getConfigFactoryClass(cr, configType, configName);
  const port = getConfigPort(cr, configType, configName);
  const host = getConfigHost(cr, configType, configName);
  const protocols = getConfigProtocols(cr, configType, configName);
  const isSSLEnabled = getConfigSSLEnabled(cr, configType, configName);
  const bindToAllInterfaces = getConfigBindToAllInterfaces(
    cr,
    configType,
    configName,
  );

  const onChangeClass = (value: string) => {
    if (configType === ConfigType.acceptors) {
      dispatch({
        operation: ArtemisReducerOperations712.updateAcceptorFactoryClass,
        payload: {
          name: configName,
          class: value as 'invm' | 'netty',
        },
      });
    }
    if (configType === ConfigType.connectors) {
      dispatch({
        operation: ArtemisReducerOperations712.updateConnectorFactoryClass,
        payload: {
          name: configName,
          class: value as 'invm' | 'netty',
        },
      });
    }
  };

  const onHostChange = (host: string) => {
    dispatch({
      operation: ArtemisReducerOperations712.setConnectorHost,
      payload: {
        connectorName: configName,
        host: host,
      },
    });
  };

  const onPortChange = (port: string) => {
    if (configType === ConfigType.acceptors) {
      dispatch({
        operation: ArtemisReducerOperations712.setAcceptorPort,
        payload: {
          name: configName,
          port: Number(port),
        },
      });
    }
    if (configType === ConfigType.connectors) {
      dispatch({
        operation: ArtemisReducerOperations712.setConnectorPort,
        payload: {
          name: configName,
          port: Number(port),
        },
      });
    }
  };

  const onProtocolsChange = (prot: string) => {
    if (configType === ConfigType.acceptors) {
      dispatch({
        operation: ArtemisReducerOperations712.setAcceptorProtocols,
        payload: {
          configName: configName,
          protocols: prot,
        },
      });
    }
    if (configType === ConfigType.connectors) {
      dispatch({
        operation: ArtemisReducerOperations712.setConnectorProtocols,
        payload: {
          configName: configName,
          protocols: prot,
        },
      });
    }
  };

  const handleSSLEnabled = (value: boolean) => {
    if (configType === ConfigType.acceptors) {
      dispatch({
        operation: ArtemisReducerOperations712.setAcceptorSSLEnabled,
        payload: {
          name: configName,
          sslEnabled: value,
        },
      });
    }
    if (configType === ConfigType.connectors) {
      dispatch({
        operation: ArtemisReducerOperations712.setConnectorSSLEnabled,
        payload: {
          name: configName,
          sslEnabled: value,
        },
      });
    }
  };

  const onBindToAllInterfacesChange = (checked: boolean) => {
    if (configType === ConfigType.acceptors) {
      dispatch({
        operation: ArtemisReducerOperations712.setAcceptorBindToAllInterfaces,
        payload: {
          name: configName,
          bindToAllInterfaces: checked,
        },
      });
    }
    if (configType === ConfigType.connectors) {
      dispatch({
        operation: ArtemisReducerOperations712.setConnectorBindToAllInterfaces,
        payload: {
          name: configName,
          bindToAllInterfaces: checked,
        },
      });
    }
  };

  const options = [
    { value: 'netty', label: 'Netty', disabled: false },
    { value: 'invm', label: 'InVM', disabled: false },
  ];

  const { t } = useTranslation();
  return (
    <>
      <FormFieldGroup
        header={
          <FormFieldGroupHeader
            titleText={{
              text: t('Global configuration'),
              id: 'field-group-configuration' + configName,
            }}
          />
        }
      >
        <Grid hasGutter md={6}>
          {configType === ConfigType.acceptors && (
            <FormGroup
              label={t('BindToAllInterfaces')}
              fieldId="horizontal-form-bindToAllInterfaces"
            >
              <Checkbox
                label={t('Bind to all interfaces')}
                isChecked={bindToAllInterfaces}
                name={'check-bindToAllInterfaces' + configType + configName}
                id={'check-bindToAllInterfaces' + configType + configName}
                onChange={(_event, checked: boolean) =>
                  onBindToAllInterfacesChange(checked)
                }
              />
            </FormGroup>
          )}
          <FormGroup
            label={t('Encryption')}
            fieldId="horizontal-form-Enicryption"
            labelIcon={
              <PresetAlertPopover
                configName={configName}
                configType={configType}
                kind="warning"
              />
            }
          >
            <Switch
              id={'ssl-switch' + configType + configName}
              label={t('SSL Enabled')}
              labelOff="SSL disabled"
              isChecked={isSSLEnabled}
              onChange={(_event, value: boolean) => handleSSLEnabled(value)}
              ouiaId="BasicSwitch"
            />
          </FormGroup>
          {configType === ConfigType.acceptors && (
            <FormGroup
              label={t('Expose')}
              fieldId="horizontal-form-expose"
              labelIcon={
                <PresetAlertPopover
                  configName={configName}
                  configType={configType}
                  kind="caution"
                />
              }
            >
              <Checkbox
                label={t('Expose')}
                isChecked={
                  getAcceptor(cr, configName)
                    ? getAcceptor(cr, configName).expose
                    : false
                }
                name={'check-expose' + configType + configName}
                id={'check-expose' + configType + configName}
                onChange={(_event, v) =>
                  dispatch({
                    operation: ArtemisReducerOperations712.setIsAcceptorExposed,
                    payload: {
                      name: configName,
                      isExposed: v,
                    },
                  })
                }
              />
            </FormGroup>
          )}
          {configType === ConfigType.acceptors && (
            <SelectExposeMode
              configName={configName}
              configType={configType}
              selectedExposeMode={
                getAcceptor(cr, configName)
                  ? getAcceptor(cr, configName).exposeMode
                  : ''
              }
              setSelectedExposeMode={(v) =>
                dispatch({
                  operation: ArtemisReducerOperations712.setAcceptorExposeMode,
                  payload: {
                    name: configName,
                    exposeMode: v ? (v as ExposeMode) : undefined,
                  },
                })
              }
              clearExposeMode={() =>
                dispatch({
                  operation: ArtemisReducerOperations712.setAcceptorExposeMode,
                  payload: {
                    name: configName,
                    exposeMode: undefined,
                  },
                })
              }
            />
          )}
          <FormGroup
            label={t('Factory Class')}
            isRequired
            fieldId={'horizontal-form-factory-' + configType + configName}
          >
            <FormSelect
              label={t('acceptorFactoryClass')}
              value={selectedClass}
              onChange={(_event, value: string) => onChangeClass(value)}
              aria-label="FormSelect Input"
            >
              {options.map((option, index) => (
                <FormSelectOption
                  isDisabled={option.disabled}
                  key={index}
                  value={option.value}
                  label={option.label}
                />
              ))}
            </FormSelect>
          </FormGroup>
          {configType === ConfigType.connectors && (
            <FormGroup
              label={t('Host')}
              isRequired
              fieldId={'horizontal-form-host-' + configType + configName}
            >
              <TextInput
                isDisabled={selectedClass === 'invm'}
                value={host}
                isRequired
                type="text"
                id={'horizontal-form-host-' + configType + configName}
                aria-describedby="horizontal-form-host-helper"
                name={'horizontal-form-host' + configType + configName}
                onChange={(_event, host: string) => onHostChange(host)}
              />
            </FormGroup>
          )}
          {configType === ConfigType.acceptors && (
            <FormGroup
              label={t('ingressHost')}
              fieldId="horizontal-form-ingressHost"
              labelIcon={
                <PresetAlertPopover
                  configName={configName}
                  configType={configType}
                  kind="caution"
                />
              }
            >
              <TextInput
                label={t('ingressHost')}
                name={'ingressHost' + configType + configName}
                id={'ingressHost' + configType + configName}
                value={
                  getAcceptor(cr, configName) &&
                  getAcceptor(cr, configName).ingressHost
                    ? getAcceptor(cr, configName).ingressHost
                    : ''
                }
                onChange={(_event, v) =>
                  dispatch({
                    operation:
                      ArtemisReducerOperations712.setAcceptorIngressHost,
                    payload: {
                      name: configName,
                      ingressHost: v,
                    },
                  })
                }
              />
            </FormGroup>
          )}
          <FormGroup
            label={t('Port')}
            isRequired
            fieldId={'horizontal-form-port-' + configType + configName}
          >
            <TextInput
              isDisabled={selectedClass === 'invm'}
              value={port}
              isRequired
              type="number"
              id={'horizontal-form-port-' + configType + configName}
              aria-describedby="horizontal-form-port-helper"
              name="horizontal-form-port"
              onChange={(_event, port: string) => onPortChange(port)}
            />
          </FormGroup>
          <FormGroup
            label={t('Protocols')}
            isRequired
            fieldId="horizontal-form-protocols"
          >
            <TextInput
              value={protocols}
              isRequired
              type="text"
              id="horizontal-form-protocols"
              aria-describedby="horizontal-form-protocols-helper"
              name="horizontal-form-protocols"
              onChange={(_event, prot: string) => onProtocolsChange(prot)}
            />
          </FormGroup>
        </Grid>
      </FormFieldGroup>
      <FormFieldGroup
        header={
          <FormFieldGroupHeader
            titleText={{
              text: t('Other parameters'),
              id: 'field-group-configuration' + configName,
            }}
          />
        }
      >
        <OtherParameters configName={configName} configType={configType} />
      </FormFieldGroup>
      {isSSLEnabled && (
        <FormFieldGroup
          header={
            <FormFieldGroupHeader
              titleText={{
                text: t('SSL configuration'),
                id: 'field-group-configuration-ssl' + configName,
              }}
            />
          }
        >
          <CertSecretSelector
            namespace={cr.metadata.namespace}
            isCa={false}
            configType={configType}
            configName={configName}
            canSetCustomNames
          />
          <CertSecretSelector
            namespace={cr.metadata.namespace}
            isCa={true}
            configType={configType}
            configName={configName}
          />
        </FormFieldGroup>
      )}
      {configType === ConfigType.acceptors && cr.spec.resourceTemplates && (
        <FormFieldGroup
          header={
            <FormFieldGroupHeader
              titleText={{
                text: t('Presets'),
                id: 'field-group-configuration-annotations' + configName,
              }}
            />
          }
        >
          <ListPresets acceptor={getAcceptor(cr, configName)} />
        </FormFieldGroup>
      )}
    </>
  );
};
