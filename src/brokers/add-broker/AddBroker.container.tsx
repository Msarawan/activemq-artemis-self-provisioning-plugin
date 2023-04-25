import { FC, useState } from 'react';
import { useHistory, RouteComponentProps } from 'react-router-dom';
import { k8sCreate } from '@openshift-console/dynamic-plugin-sdk';
import { AlertVariant } from '@patternfly/react-core';
import { AddBroker } from './AddBroker.component';
import {
  EditorToggle,
  EditorType,
} from '../add-broker/components/EditorToggle/EditorToggle.component';
import { AMQBrokerModel, K8sResourceCommon } from '../../utils';

type AddBrokerPageProps = RouteComponentProps<{ ns?: string }>;

const AddBrokerPage: FC<AddBrokerPageProps> = ({ match }) => {
  const history = useHistory();
  const namespace = match.params.ns || 'default';
  const defaultNotification = { title: '', variant: AlertVariant.default };

  const initialResourceYAML: K8sResourceCommon = {
    apiVersion: 'broker.amq.io/v1beta1',
    kind: 'ActiveMQArtemis',
    metadata: {
      name: 'default',
      namespace,
    },
    spec: {
      deploymentPlan: {
        image: 'placeholder',
        requireLogin: false,
        size: 1,
      },
    },
  };

  //states
  const [notification, setNotification] = useState(defaultNotification);
  const [editorType, setEditorType] = useState<EditorType>();

  const handleRedirect = () => {
    history.push(`brokers`);
  };

  const handleChange = (editorType: EditorType) => {
    setEditorType(editorType);
  };

  const k8sCreateBroker = (content: K8sResourceCommon) => {
    k8sCreate({ model: AMQBrokerModel, data: content })
      .then(() => {
        setNotification(defaultNotification);
        handleRedirect();
      })
      .catch((e) => {
        setNotification({ title: e.message, variant: AlertVariant.danger });
        console.error(e);
      });
  };

  return (
    <>
      <EditorToggle value={editorType} onChange={handleChange} />
      <AddBroker
        namespace={namespace}
        notification={notification}
        onCreateBroker={k8sCreateBroker}
        initialResourceYAML={initialResourceYAML}
      />
    </>
  );
};

export default AddBrokerPage;
