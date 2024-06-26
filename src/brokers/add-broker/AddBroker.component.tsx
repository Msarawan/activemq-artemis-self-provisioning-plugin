import { FC, useContext } from 'react';
import { K8sResourceCommon } from '@openshift-console/dynamic-plugin-sdk';
import { AlertVariant, Divider } from '@patternfly/react-core';
import { YamlEditorView, EditorToggle, FormView } from './components';
import {
  ArtemisReducerOperations,
  BrokerCreationFormState,
  BrokerCreationFormDispatch,
  EditorType,
} from '../utils';

type AddBrokerProps = {
  onCreateBroker: (data?: K8sResourceCommon) => void;
  notification: {
    title: string;
    variant: AlertVariant;
  };
  isUpdate?: boolean;
};

const AddBroker: FC<AddBrokerProps> = ({
  onCreateBroker,
  notification,
  isUpdate,
}) => {
  const formValues = useContext(BrokerCreationFormState);
  const dispatch = useContext(BrokerCreationFormDispatch);

  const { editorType } = formValues;

  const onSelectEditorType = (editorType: EditorType) => {
    dispatch({
      operation: ArtemisReducerOperations.setEditorType,
      payload: editorType,
    });
  };

  return (
    <>
      <Divider />
      <EditorToggle value={editorType} onChange={onSelectEditorType} />
      <Divider />
      {editorType === EditorType.BROKER && (
        <FormView
          onCreateBroker={onCreateBroker}
          notification={notification}
          isUpdate={isUpdate}
        />
      )}
      {editorType === EditorType.YAML && (
        <YamlEditorView
          onCreateBroker={onCreateBroker}
          initialResourceYAML={formValues.cr}
          notification={notification}
          isUpdate={isUpdate}
        />
      )}
    </>
  );
};

export { AddBroker };
