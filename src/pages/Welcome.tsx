import {
  ProForm, ProFormText, ProFormGroup, ProFormUploadButton, ProFormSelect
} from '@ant-design/pro-components';
import {
  Card, message, Tooltip, Row, Col, Table, Spin, Button, Upload, Select
} from 'antd';
import { useAnchorWallet } from '@solana/wallet-adapter-react';
import React, {useState, useEffect} from 'react';
import {addStore, analyseGo, currentUser, updateUser} from "@/services/ant-design-pro/api";
import {history, useIntl} from "umi";
import ProCard from '@ant-design/pro-card';
import { FormattedMessage } from 'umi';
import styles from './Welcome.less'
import axios from 'axios';
import { Collapse, Modal } from 'antd';
import EmptyPageTwo from "@/pages/EmptyPageTwo";
import { UploadOutlined } from "@ant-design/icons";
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { Program, AnchorProvider, web3, BN } from '@project-serum/anchor';
import idl from './idl.json'; // path to your IDL file
import { PublicKey } from '@solana/web3.js';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import {
  ConnectionProvider,
  WalletProvider
} from '@solana/wallet-adapter-react';
import {
  WalletModalProvider
} from '@solana/wallet-adapter-react-ui';
import '@solana/wallet-adapter-react-ui/styles.css';

import {
  PhantomWalletAdapter
} from '@solana/wallet-adapter-wallets';

// 添加window类型扩展
declare global {
  interface Window {
    solana?: any;
  }
}

const wallets = [new PhantomWalletAdapter()];
const endpoint = 'https://api.devnet.solana.com';

const { Panel } = Collapse;
const programID = new PublicKey('6yvVzXaA1FahujqSnKWMJcnVihom3Usci3dsfRDiPhQ7');
const rewardAccountSeed = 'user';

// 将Welcome组件移出WalletProvider范围，创建一个内部组件来使用钱包功能
const WelcomeContent: React.FC = () => {
  const anchorWallet = useAnchorWallet();
  const { connection } = useConnection();
  const { publicKey, signTransaction, wallet } = useWallet();
  const [userId, setUserId] = useState<string>('');
  const [uploadResponse, setUploadResponse] = useState(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);
  const [access, setAccess] = useState<number>();
  const [infoWarn, setInfoWarn] = useState<boolean>();
  const [loading, setLoading] = useState(false);
  const [uploadImgOk, setUploadImgOk] = useState<string[]>([]);
  const [currentOption, setCurrentOption] = useState<number | null>(0); // 初始化为0
  const [isExpanded, setIsExpanded] = useState(false);
  const [isExpanded1, setIsExpanded1] = useState(false);
  const [isExpanded2, setIsExpanded2] = useState(false);
  const intl = useIntl();
  const alt1 = [
    "",
    intl.formatMessage({ id: 'forehead_left' }),
    intl.formatMessage({ id: 'forehead_right' }),
    intl.formatMessage({ id: 'forehead_middle' }),
    intl.formatMessage({ id: 'top_of_head' }),
    intl.formatMessage({ id: 'back_of_head' }),
    intl.formatMessage({ id: 'temples_left' }),
    intl.formatMessage({ id: 'temples_right' }),
    intl.formatMessage({ id: 'occipital_follicles' }),
    intl.formatMessage({ id: 'occipital_hair_shaft' })
  ];

  const showModal = () => {
    if (infoWarn) {
      Modal.info({
        title: '缺少信息',
        content: '请在更新信息中填写年龄与性别以完成个人信息。',
      });
    }
  };

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
        if (currentUser1?.age == null || currentUser1.gender == null) {
          setInfoWarn(true)
        } else {
          setInfoWarn(false)
        }
      } catch (error) {
        console.error('Error fetching user ID:', error);
      }
    };

    fetchUserId().then(r => {
      console.log(r);
    });
    showModal()
  }, []);

  // 添加一个简单的钱包监听器
  useEffect(() => {
    // 检查钱包连接状态
    const checkWalletConnection = () => {
      if (publicKey) {
        console.log(intl.formatMessage({ id: 'wallet_connected' }), publicKey.toString());
        message.success(`Wallet connected: ${publicKey.toString().slice(0, 6)}...`);
        
        // 可选：读取余额
        connection.getBalance(publicKey).then(balance => {
          console.log(`Balance: ${balance / web3.LAMPORTS_PER_SOL} SOL`);
        }).catch(console.error);
      } else {
        console.log(intl.formatMessage({ id: 'wallet_not_connected' }));
      }
    };
    
    // 首次检查
    checkWalletConnection();
    
    // 监听连接变化
    if (wallet) {
      const walletAdapter = wallet as any;
      const onConnect = () => {
        console.log(intl.formatMessage({ id: 'wallet_connect_event' }));
        checkWalletConnection();
      };
      
      if (walletAdapter.on) {
        walletAdapter.on('connect', onConnect);
        
        return () => {
          if (walletAdapter.off) {
            walletAdapter.off('connect', onConnect);
          }
        };
      }
    }
  }, [publicKey, wallet, connection]);
  
  // 手动连接钱包函数
  const connectWallet = async () => {
    try {
      console.log(intl.formatMessage({ id: 'attempting_to_connect' }));
      // 检查是否有钱包
      if (!wallet) {
        message.error(intl.formatMessage({ id: 'no_wallet_detected' }));
        return;
      }
      
      // 尝试通过钱包适配器连接
      const walletAdapter = wallet as any;
      if (walletAdapter.connect) {
        console.log(intl.formatMessage({ id: 'connecting_wallet' }));
        await walletAdapter.connect();
        console.log(intl.formatMessage({ id: 'connection_command_sent' }));
      } else {
        // 尝试通过DOM触发官方按钮
        const walletButtonElement = document.querySelector('.wallet-adapter-button-trigger');
        if (walletButtonElement) {
          console.log(intl.formatMessage({ id: 'found_wallet_button' }));
          (walletButtonElement as HTMLElement).click();
        } else {
          message.error(intl.formatMessage({ id: 'wallet_button_not_found' }));
        }
      }
    } catch (error) {
      console.error(intl.formatMessage({ id: 'wallet_connection_failed' }), error);
      message.error(intl.formatMessage({ id: 'wallet_connection_failed' }) + ": " + (error instanceof Error ? error.message : String(error)));
    }
  };
  
  // 断开钱包连接
  const disconnectWallet = async () => {
    if (!wallet) return;
    
    try {
      const walletAdapter = wallet as any;
      if (walletAdapter.disconnect) {
        await walletAdapter.disconnect();
        message.success(intl.formatMessage({ id: 'wallet_disconnected' }));
      }
    } catch (error) {
      console.error(intl.formatMessage({ id: 'disconnect_failed' }), error);
    }
  };

  // 数据处理和表格列定义
  let data1: readonly any[] | undefined = [];
  if (uploadResponse) {
    const parsedResponse = JSON.parse(uploadResponse);
    data1 = [
      {
        key: '1',
        position: Array.isArray(parsedResponse.POSITION) ? parsedResponse.POSITION.join(", ") : parsedResponse.POSITION,
        stage: Array.isArray(parsedResponse.STAGE) ? parsedResponse.STAGE.join(", ") : parsedResponse.STAGE,
      },
    ];
  }

  const handleViewDetails = async () => {
      
  };
 
  // 更新txn函数
  const txn = async (event: any) => {
  event?.preventDefault?.();

  if (!anchorWallet || !anchorWallet.publicKey) {
    message.error('Connect wallet first!');
    return;
  }

  try {
    const provider = new AnchorProvider(
      connection,
      anchorWallet,
      { preflightCommitment: 'processed' }
    );

    const program = new Program(idl as any, programID, provider);

    const [rewardAccountPDA] = await PublicKey.findProgramAddress(
      [Buffer.from(rewardAccountSeed), anchorWallet.publicKey.toBuffer()],
      programID
    );

    // 🟡 Step 1: Initialize user if needed
    try {
      await program.methods
        .initializeUser()
        .accounts({
          rewardAccount: rewardAccountPDA,
          user: anchorWallet.publicKey,
          systemProgram: web3.SystemProgram.programId, // required by most `init` accounts
        })
        .rpc();

      console.log("User initialized");
    } catch (initErr) {
      if (initErr.message?.includes("already in use") || initErr.message?.includes("Account already initialized")) {
        console.warn("User already initialized");
      } else {
        throw initErr; // other errors should still bubble up
      }
    }

    // 🟡 Step 2: Proceed with rewardAction
    const currentDay = Math.floor(Date.now() / (1000 * 60 * 60 * 24));

    const tx = await program.methods
      .rewardAction({ login: {} }, new BN(currentDay))
      .accounts({
        rewardAccount: rewardAccountPDA,
        user: anchorWallet.publicKey,
      })
      .rpc();

    console.log('Transaction successful:', tx);
    message.success('Transaction successful');

    const msg = await analyseGo({ userId });
    if (msg.success) {
      const defaultLoginSuccessMessage = intl.formatMessage({ id: 'successfully_sent' });
      showPointsAnimation();
      message.success(defaultLoginSuccessMessage);
      history.push({
        pathname: "/res",
        state: {
          data: msg.data,
        },
      });
    }

  } catch (err) {
    console.error('Transaction failed:', err);
    message.error('Transaction failed：' + (err instanceof Error ? err.message : String(err)));
  }
};
    
    // console.log(intl.formatMessage({ id: 'transaction_request' }), {
    //   publicKey: publicKey?.toString(),
    //   connected: wallet ? (wallet as any).connected : false
    // });
    
    // if (!publicKey) {
    //   message.error(intl.formatMessage({ id: 'connect_wallet_first' }));
      
    //   // 尝试自动连接钱包
    //   connectWallet();
    //   return;
    // }

    // try {
    //   // 使用类型断言来解决TypeScript错误
    //   const provider = new AnchorProvider(
    //     connection, 
    //     wallet as any, 
    //     { preflightCommitment: 'processed' }
    //   );

    //   const program = new Program(idl as any, programID, provider);

    //   const [rewardAccountPDA] = await PublicKey.findProgramAddress(
    //     [Buffer.from(rewardAccountSeed), publicKey.toBuffer()],
    //     programID
    //   );

    //   const currentDay = Math.floor(Date.now() / (1000 * 60 * 60 * 24));

    //   const tx = await program.methods
    //     .rewardAction({ login: {} }, new BN(currentDay))
    //     .accounts({
    //       rewardAccount: rewardAccountPDA,
    //       user: publicKey,
    //     })
    //     .rpc();

    //   console.log('Transaction successful:', tx);
    //   message.success('Transaction successful');
    // } catch (err) {
    //   console.error('Transaction failed:', err);
    //   message.error('Transaction failed：' + (err instanceof Error ? err.message : String(err)));
    // }
  
  // 设置表格列
  const columns = [
    {
      title: intl.formatMessage({ id: 'position' }),
      dataIndex: 'position',
      key: 'position',
    },
    {
      title: intl.formatMessage({ id: 'stage' }),
      dataIndex: 'stage',
      key: 'stage',
    },
  ];

  const handleImageClick = async (currentIndex: number | React.SetStateAction<null>) => {
    // 存储当前选择的图片索引
    // @ts-ignore
    setSelectedImageIndex(currentIndex);

    // 触发文件选择
    // @ts-ignore
    document.getElementById('hiddenFileInput').click();
  };

  const gotoAna = async () => {
    if (infoWarn) {
      const errorMessage = intl.formatMessage({ id: 'user_info_not_completed' });
      message.error(errorMessage);
    }
    if (uploadImgOk.length == 0) {
      const errorMessage = intl.formatMessage({ id: 'upload_at_least_one' });
      message.error(errorMessage);
    } else {
      const msg = await analyseGo({userId});
      if (msg.success) {
        const defaultLoginSuccessMessage = intl.formatMessage({ id: 'successfully_sent' });
        message.success(defaultLoginSuccessMessage);
        history.push({
          pathname: "/res",
          state: {
            data: msg.data,
          },
        });
      }
    }
  };

  const collapseStyle = {
    backgroundColor: '#444',
    border: 'none',
    color: 'white',
    padding: '4px 16px',
    borderRadius: '8px',
    boxShadow: '0 0 5px #00f, 0 0 25px #00f, 0 0 50px #00f, 0 0 200px #00f',
    cursor: 'pointer',
    marginTop: '50px',
    marginLeft: '25px',
    transition: 'all 0.3s'
  }

  const expandedCollapseStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,  // 设置一个高的z-index确保它出现在其他内容之上
    backgroundColor: '#fff'  // 或其他背景颜色
  };

  // 修改头像
  const customRequest = async ({ file, onSuccess, onError }) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('userId', userId);  // 添加你的 userId

    try {
      const response = await axios.post('/api/user/changeImage', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      if (response.data) {
        onSuccess();
        message.success('头像上传成功！');
      }
    //     console.log("hey")
    // const web3Modal = new Web3Modal();
    // const connection = await web3Modal.connect();
    // const provider = new ethers.providers.Web3Provider(connection);
    // const signer = await provider.getSigner();
    // const contract = new ethers.Contract(
    //   '0x6A6237a730106aBc953A7d5cC5Ff50394eFa8d5a',
    //   preferenceAbi,
    //   signer
    // );
    // const txnn = await contract.recordPurchase(
    // );
    // await txnn.wait();
    // console.log(txnn);
    } catch (error) {
      onError(error);
      message.error('头像上传失败！');
    }
  };

  const handleChange = (info) => {
    if (info.file.status === 'done') {
      // 保存上传的响应
      setUploadResponse(info.file.response.data.data);
    }
  };

  return (
    <div style={{
      height: '90vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      position: 'relative',
      background: 'url(/b1.jpg) center/cover no-repeat #fff',
      borderRadius: '16px'
    }}>
      <h1 style={{fontSize: '5em', color: '#fff', zIndex: 1}}>LUSHAIR</h1>
      <h2 style={{color: '#fff', zIndex: 1}}><FormattedMessage id="Your own AI hair care assistant" /></h2>

      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        alignItems: 'center',
        margin: '0 auto',
        maxWidth: '1200px'
      }}>
        <Collapse
          defaultActiveKey={[]}
          style={isExpanded1 ? {...expandedCollapseStyle as any} : {...collapseStyle as any}}
          onChange={() => setIsExpanded1(!isExpanded1)}
        >
          <Panel header={<FormattedMessage id="t3"/>} key="1">
            <ProCard style={{ borderRadius: '8px', backgroundColor: '#f5f5f7' }}>
              <ProForm
                onValuesChange={(_, values) => {
                  console.log(values);
                }}
                onFinish={async (values) => {
                  const data = Object.assign({}, values, { userId: userId });
                  const msg = await updateUser({ ...data });
                  if (msg.data) {
                    const defaultLoginSuccessMessage = intl.formatMessage({ id: 'successfully_sent' });
                    message.success(defaultLoginSuccessMessage);
                    window.location.reload(); // 刷新页面
                  }
                }}
                style={{ borderRadius: '8px' }}
                autoFocus={false}
              >
                <ProFormGroup>
                  <ProFormText width="md" name="age" label={<FormattedMessage id="age" />} className={styles.roundedInput} />

                  <ProFormSelect
                    options={[
                      {
                        value: '1',
                        label: '男'
                      },
                      {
                        value: '2',
                        label: '女'
                      }
                    ]}
                    width="md"
                    name="gender"
                    label={<FormattedMessage id="gender" />}
                    className="rounded-select"
                  />
                  <ProFormText width="md" name="name" label={<FormattedMessage id="name" />} className={styles.roundedInput} />

                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Upload customRequest={customRequest} showUploadList={false}>
                      <Button icon={<UploadOutlined />}><FormattedMessage id="uploadImg" /></Button>
                    </Upload>
                  </div>
                  <img src={'/woman.svg'} alt="woman" style={{ marginBottom: '30px', marginLeft: '70px' }} />
                </ProFormGroup>
              </ProForm>
            </ProCard>
          </Panel>
        </Collapse>

        {access === 0 && (
          <Collapse
            defaultActiveKey={[]}
            style={isExpanded2 ? {...expandedCollapseStyle as any} : {...collapseStyle as any}}
            onChange={() => setIsExpanded2(!isExpanded2)}
          >
            <Panel header={<FormattedMessage id="t9"/>} key="1">
              <ProCard style={{ borderRadius: '8px', backgroundColor: '#f5f5f7' }}>
                <ProForm
                  onValuesChange={(_, values) => {
                    console.log(values);
                  }}
                  onFinish={async (values) => {
                    const data = Object.assign({}, values, { userId: userId });
                    const msg = await addStore({ ...data });
                    if (msg) {
                      const defaultLoginSuccessMessage = intl.formatMessage({ id: 'successfully_sent' });
                      message.success(defaultLoginSuccessMessage);
                    }
                  }}
                  style={{ borderRadius: '8px' }}
                  autoFocus={false}
                >
                  <ProFormGroup>
                    <ProFormText width="md" name="phone" label={<FormattedMessage id="phone"/>} className={styles.roundedInput} />
                  </ProFormGroup>
                </ProForm>
              </ProCard>
            </Panel>
          </Collapse>
        )}

        <Collapse
          defaultActiveKey={[]}
          style={isExpanded ? {...expandedCollapseStyle as any} : {...collapseStyle as any}}
          onChange={() => setIsExpanded(!isExpanded)}
        >
          <Panel header={<FormattedMessage id="t6"/>} key="1">
            {/*全点位分析*/}
            <Card
              style={{
                borderRadius: '8px',
                backgroundColor: '#f5f5f7',
                marginBottom: '20px'
              }}
              className={styles.quanD}
              extra={<div style={{ marginTop: '20px', textAlign: 'center' }}>
                <WalletMultiButton />
              </div>}
            >
              {/* 钱包状态显示 */}
              {/* <div style={{ margin: '20px 0', padding: '10px', background: 'rgba(0,0,0,0.5)', borderRadius: '8px', color: 'white' }}>
                <p>Wallet Status: {publicKey ? 'Connected ✅ ' + publicKey.toString().slice(0, 6) + '...' + publicKey.toString().slice(-4) : 'Not Connected ❌'}</p>
                
                {!publicKey && (
                  <Button 
                    onClick={connectWallet} 
                    type="primary" 
                    style={{ marginRight: '10px' }}
                  >
                    Connect Wallet
                  </Button>
                )}
                
                {publicKey && (
                  <Button 
                    onClick={disconnectWallet} 
                    danger
                    style={{ marginRight: '10px' }}
                  >
                    Disconnect
                  </Button>
                )}
                
                <div style={{ position: 'absolute', right: '-9999px' }}>
                  <WalletMultiButton />
                </div>
              </div> */}
              <ProForm
                onFinish={async () => {
                  // 验证用户信息和图片上传
                  if (infoWarn) {
                    const errorMessage = intl.formatMessage({ id: 'user_info_not_completed' });
                    message.error(errorMessage);
                    return;
                  }
                  if (uploadImgOk.length == 0) {
                    const errorMessage = intl.formatMessage({ id: 'upload_at_least_one' });
                    message.error(errorMessage);
                    return;
                  }
                  try {
                    // 尝试执行交易
                    await txn("");
                  } catch (error) {
                    console.error("处理失败:", error);
                  }
                }}
              >
                <p><FormattedMessage id="t4" /></p>

                {uploadImgOk.length > 0 && (
                  <p><FormattedMessage id="t8" />：{uploadImgOk.join('、')}</p>
                )}

                <Spin spinning={loading} size="large" tip={intl.formatMessage({ id: 'uploading_please_wait' })}>
                  <input
                    type="file"
                    id="hiddenFileInput"
                    style={{ display: 'none' }}
                    onChange={(e) => {
                      // 你的文件上传逻辑
                      // @ts-ignore
                      const file = e.target.files[0];
                      if (file) {
                        // @ts-ignore
                        const newFile = new File([file], `${selectedImageIndex + 1}.png`, {
                          type: file.type,
                        });
                        const formData = new FormData();
                        formData.append('userId', userId);
                        formData.append('file', newFile);  // 'file' 是发送到后端的键，根据你的后端 API 进行相应的更改

                        // 显示上传中提示

                        setLoading(true)

                        axios.post("/api/file/upload", formData, {
                          headers: {
                            'Content-Type': 'multipart/form-data'
                          }
                        })
                          .then(response => {
                            // 隐藏上传中提示
                            setLoading(false)
                            // 处理响应，例如:
                            if(response.data.data.success) {
                              message.success(intl.formatMessage({ id: 'upload_successful' }));
                              if (selectedImageIndex !== null) {
                                setUploadImgOk(prev => [...prev, alt1[selectedImageIndex + 1]]);
                              }

                            } else {
                              message.error(intl.formatMessage({ id: 'upload_failed' }));
                            }
                          })
                          .catch(error => {
                            // 隐藏上传中提示
                            setLoading(false)
                            // 错误处理，例如:
                            message.error(intl.formatMessage({ id: 'error_during_upload' }) + ": " + error.message);
                          });
                        // @ts-ignore
                        e.target.value = null;
                      }
                    }}
                  />
                </Spin>
                <div>
                  {/* 上方的按钮，用于选择当前的上传选项 */}
                  <Select
                    style={{ width: 200 }}
                    onChange={value => setCurrentOption(value)}
                    defaultValue={currentOption}
                  >
                    {alt1.slice(1).map((option, index) => (
                      <Select.Option value={index} key={index}>
                        {option}
                      </Select.Option>
                    ))}
                  </Select>

                  {/* 下方的上传组件，仅显示当前选中的上传选项 */}
                  <div>
                    {currentOption !== null && (
                      <Row gutter={[16, 16]}>
                        <Col xs={24} sm={8} md={8} lg={8} xl={8}>
                          <Card
                            hoverable
                            style={{
                              display: 'flex',
                              justifyContent: 'center',
                              alignItems: 'center',
                              border: '1px solid #e8e8e8',
                              transition: 'border-color 0.3s',
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.borderColor = '#B0E0E6';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.borderColor = '#e8e8e8';
                            }}
                          >
                            <Tooltip>
                              <img
                                src={`/head/${currentOption + 1}.png`}
                                alt={alt1[currentOption + 1]}
                                style={{ width: '70%', cursor: 'pointer', marginLeft: '40px' }}
                                onClick={() => handleImageClick(currentOption)}
                              />
                            </Tooltip>
                          </Card>
                          <p style={{ textAlign: 'center' }}>{alt1[currentOption + 1]}</p>
                        </Col>
                      </Row>
                    )}
                  </div>
                </div>
              </ProForm>
              <br/>
              <h4><FormattedMessage id="hisList" /></h4>
              <div style={{
                maxHeight: '50vh', // 可以根据需要设置最大高度
                overflowY: 'auto', // 如果内容超过容器，会出现垂直滚动条
                padding: '0 15px', // 可选，内部间距

              }}>
                <EmptyPageTwo />
              </div>

            </Card>
            {/*全点位分析*/}
          </Panel>
        </Collapse>

        <Collapse defaultActiveKey={[]} style={collapseStyle}>
          <Panel header={<FormattedMessage id="t7"/>} key="1">
            {/*自拍照*/}
            <Card
              style={{
                borderRadius: '8px',
                backgroundColor: '#f5f5f7',
              }}
            >
              <p><FormattedMessage id="t5" /></p>

              <Upload
                name='file'
                listType='picture-card'
                action='/api/file/faJi'
                data={{ userId }}
                onChange={handleChange}
              >
                <Button>
                  <FormattedMessage id="upload_picture" />
                </Button>
              </Upload>


              {/* 展示上传的响应 */}
              {uploadResponse && (
                <Card style={{ borderRadius: '8px', marginTop: '20px' }}>
                  <Table dataSource={data1} columns={columns} pagination={false} />
                </Card>
              )}

            </Card>
            {/*自拍照*/}
          </Panel>
        </Collapse>
      </div>
    </div>
  );
};

// 添加积分动画样式
const pointsAnimationStyle = {
  position: 'fixed',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  background: 'rgba(0, 0, 0, 0.8)',
  color: '#FFD700', // 金色文字
  fontSize: '2rem',
  fontWeight: 'bold',
  padding: '20px 40px',
  borderRadius: '10px',
  zIndex: 9999,
  animation: 'fadeInOutScale 2s ease-in-out forwards',
};

// 添加积分动画
const showPointsAnimation = () => {
  // 创建动画元素
  const animationElement = document.createElement('div');
  animationElement.innerText = '+100 HAIR Points!';
  Object.assign(animationElement.style, {
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%) scale(0.5)',
    background: 'rgba(0, 0, 0, 0.8)',
    color: '#FFD700', // 金色文字
    fontSize: '2rem',
    fontWeight: 'bold',
    padding: '20px 40px',
    borderRadius: '10px',
    zIndex: 9999,
    opacity: 0,
    transition: 'all 1s ease-in-out',
  });

  // 添加到body
  document.body.appendChild(animationElement);

  // 触发动画
  setTimeout(() => {
    animationElement.style.opacity = '1';
    animationElement.style.transform = 'translate(-50%, -50%) scale(1)';
  }, 100);

  // 动画结束后移除元素
  setTimeout(() => {
    animationElement.style.opacity = '0';
    animationElement.style.transform = 'translate(-50%, -50%) scale(1.5)';
    setTimeout(() => {
      document.body.removeChild(animationElement);
    }, 1000);
  }, 2000);
};

// 主组件，用于提供Wallet上下文
const Welcome: React.FC = () => {
  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <WelcomeContent />
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};

export default Welcome;
