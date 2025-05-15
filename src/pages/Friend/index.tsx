import { useState, useEffect } from 'react';
import ProCard from "@ant-design/pro-card";
import {ProForm, ProFormGroup, ProFormText} from "@ant-design/pro-components";
import {createFriendship, currentUser, getFriends, sendFriendRequest} from "@/services/ant-design-pro/api";
import {Collapse, message} from "antd";
import { List, Avatar, Card } from 'antd';
import styles from "@/pages/Welcome.less";
import { getPendingRequests } from "@/services/ant-design-pro/api";
import { respondToFriendRequest } from "@/services/ant-design-pro/api";
import {FormattedMessage} from "umi";
import {useIntl} from "@@/plugin-locale/localeExports";
import { Button } from 'antd';
import { useHistory } from 'react-router-dom';


const { Panel } = Collapse;

export default () => {

  const [userId, setUserId] = useState<string>('');
  const [access, setAccess] = useState<number>();
  // @ts-ignore
  const [friends, setFriends] = useState<FriendInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const intl = useIntl();
  const history = useHistory(); // 获取跳转方法


  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const response = await getFriends(userId);
        if (response.success) {
          setFriends(response?.data);
        } else {
          console.error("Failed to fetch friends:", response.msg);
        }
      } catch (error) {
        console.error("Error fetching friends:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFriends();
  }, [userId]);

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const currentUser1 = await currentUser();
        if (currentUser1?.userId) {
          setUserId(currentUser1.userId);
        }
        if (currentUser1?.access != null) {
          setAccess(currentUser1.access)
        }
      } catch (error) {
        console.error('Error fetching user ID:', error);
      }
    };

    fetchUserId().then(r => {
      console.log(r);
    });
  }, []);

  const [pendingRequests, setPendingRequests] = useState<API.FriendRequest[]>([]);

  useEffect(() => {
    const fetchPendingRequests = async () => {
      try {
        const result = await getPendingRequests(userId);
        if (result.success) {
          setPendingRequests(result.data);
        }
      } catch (error) {
        console.error('Error fetching pending requests:', error);
      }
    };

    if (userId) {
      fetchPendingRequests();
    }
  }, [userId]);

  // eslint-disable-next-line @typescript-eslint/no-shadow
  const handleCreateFriendship = async (userId: string, friendId: string) => {
    try {
      const response = await createFriendship(userId, friendId);
      if (response.success) {
        message.success(response.data);
      } else {
        message.error(response.msg || 'Failed to create friendship.');
      }
    } catch (error) {
      console.error('Error creating friendship:', error);
      message.error('An error occurred while creating the friendship.');
    }
  };

  const handleResponse = async (senderId: string, requestId: string, status: any) => {
    try {
      const response = await respondToFriendRequest(senderId ,requestId, status);
      if (response.success) {
        message.success(response.data);
        await handleCreateFriendship(senderId, requestId);
        window.location.reload();
        // Optionally, update the UI by removing the responded request or refreshing the list
      } else {
        message.error('Failed to respond to the friend request.');
      }
    } catch (error) {
      message.error('An error occurred while responding to the friend request.');
    }
  };

  const handleViewList = async (userId: any) => {
    history.push({
      pathname: "/hairCareList",
      state: {
        data: userId,
      },
    });
  };


  // @ts-ignore
  return (
    <div>
      {/*<Navbar />*/}
      {/*<br/>*/}
      <Collapse defaultActiveKey={[]} style={{ marginBottom: '20px', borderRadius: '8px', backgroundColor: '#f5f5f7' }}>
        <Panel header={<FormattedMessage id="add_friend" />} key="1">
          <ProCard style={{ borderRadius: '8px', backgroundColor: '#f5f5f7' }}>
            <ProForm
              onValuesChange={(_, values) => {
                console.log(values);
              }}
              onFinish={async (values) => {
                const data = Object.assign({}, values, { userId: userId });
                try {
                  const msg = await sendFriendRequest({ ...data });
                  if (msg.success) {
                    const defaultLoginSuccessMessage = msg.data
                    message.success(defaultLoginSuccessMessage);
                  }
                } catch (error) {
                  // @ts-ignore
                  if (error.response && error.response.status === 500) {
                    message.error('Friend request already exists!');
                  } else {
                    message.error('An error occurred while sending the friend request.');
                  }
                }

              }}
              style={{ borderRadius: '8px' }}
              autoFocus={false}
            >
              <ProFormGroup>
                <ProFormText width="md" name="phone" label={intl.formatMessage({ id: 'phone' })} className={styles.roundedInput} />
              </ProFormGroup>
            </ProForm>
          </ProCard>
        </Panel>
      </Collapse>

      <Collapse defaultActiveKey={[]} style={{ marginBottom: '20px', borderRadius: '8px', backgroundColor: '#f5f5f7' }}>
        <Panel header={`${intl.formatMessage({ id: 'pending_requests' })} (${pendingRequests.length})`} key="2">
          {pendingRequests.length === 0 ? (
            <p><FormattedMessage id="no_pending_requests" /></p>
          ) : (
            pendingRequests.map((request) => (
              <div key={request.id}>
                <p>发送者ID: {request.senderId}</p>
                <button onClick={() => handleResponse(request.senderId, request.receiverId, 'ACCEPTED')}><FormattedMessage id="accept" /></button>
                <button onClick={() => handleResponse(request.senderId, request.receiverId, 'DECLINED')}><FormattedMessage id="decline" /></button>
                {/* Add other details or actions here */}
              </div>
            ))
          )}
        </Panel>
      </Collapse>


      <List
        loading={loading}
        dataSource={friends}
        renderItem={friend => (
          <List.Item>
            <Card 
              hoverable
              style={{ width: '100%', borderRadius: '8px' }}
              cover={<Avatar size={50} src={friend.avatar} style={{margin: '10px'}} />}
              // extra={<Button onClick={() => handleViewList(friend.friendId)}><FormattedMessage id="Hair care archives" /></Button>}
              extra={ access === 1 ? <Button onClick={() => handleViewList(friend.friendId)}><FormattedMessage id="Hair care archives" /></Button> : null}
            >
              <Card.Meta
                title={friend.name}
                description={friend.level || '倔强青铜秃头星人'}
              />
            </Card>
          </List.Item>
        )}
      />

    </div>
  );
};
