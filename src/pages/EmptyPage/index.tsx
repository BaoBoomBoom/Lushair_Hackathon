import React, {useEffect, useRef, useState} from 'react';
import {Button, Card, List, Modal, Typography, Row, Col, Collapse} from 'antd';
const { Text, Title } = Typography;
import ProCard from '@ant-design/pro-card';
import {
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
  AreaChart,
  Area,
  Cell,
  Bar, BarChart
} from 'recharts';
import './YourStyles.css';
import {useLocation} from "react-router";
import html2canvas from 'html2canvas';
import {currentUser, getIngredient, getProduct} from "@/services/ant-design-pro/api";
import {LeftOutlined, RightOutlined} from "@ant-design/icons";
import {FormattedMessage} from "umi";
import {useIntl} from "@@/plugin-locale/localeExports";
import {useHistory} from "react-router-dom";
import ErrorBoundaryWrapper from "@/ErrorBoundaryWrapper";
import HistoryCard from "@/pages/his/HistoryCard";
import TrendChart from '@/pages/his/HistoryCard';
const { Panel } = Collapse;


type Item = {
  title: string;
  score: number;
  grade: string;
  advice: string;
  intro: string;
  res: string;
};

export default () => {
  const [res, setRes] = useState<any>(null);
  const [scoreMaps, setScoreMaps] = useState<Item[] | null>(null);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [historyData, setHistoryData] = useState<any[]>([]);
  const cardRef = useRef(null);
  const [isModalVisible1, setIsModalVisible1] = useState(false);
  const [selectedImage, setSelectedImage] = useState('');
  const [userId, setUserId] = useState<string>('');
  const [product, setProduct] = useState<any>([]);
  const [ingredient, setIngredient] = useState<any>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const rightSectionRef = useRef(null);
  const intl = useIntl();
  const [d1, setD1] = useState()
  const [d2, setD2] = useState()
  const history = useHistory(); // 获取跳转方法

  const gradientColors = ['#6A91E6', '#3C58BF'];

  const nextImage = () => {
    if (currentImageIndex < imageUrls.length - 1) {
      setCurrentImageIndex(currentImageIndex + 1);
    }
  };

  const prevImage = () => {
    if (currentImageIndex > 0) {
      setCurrentImageIndex(currentImageIndex - 1);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const currentUser1 = await currentUser();
        if (currentUser1?.userId) {
          setUserId(currentUser1.userId);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []); // 注意这里的依赖数组为空

  useEffect(() => {
    if (userId) { // 只有当 userId 被设置之后才执行
      const getList = async () => {
        try {
          const data1 = await getProduct({userId});
          setProduct(data1.data);
        } catch (error) {
          console.error(error)
        }
      };
      const getIngredient1 = async () => {
        try {
          const data2 = await getIngredient({userId});
          setIngredient(data2.data);
        } catch (error) {
          console.log(error)
        }
      }
      getList();
      getIngredient1();
    }
  }, [userId]); // 这里的依赖数组只有 userId

  const location = useLocation();
  const pos = res?.pos; // 从res中获取位置数据

  const [selectedImageUrl, setSelectedImageUrl] = useState<string | null>(null);

  const handleImageClick = (url: string) => {
    setSelectedImageUrl(url);
  };


  const getPositionName = (key: string) => {
    switch (key) {
      case '1': return '前额左';
      case '2': return '前额右';
      case '3': return '前额中';
      case '4': return '头顶';
      case '5': return '后枕部';
      case '6': return '两鬓左';
      case '7': return '两鬓右';
      case '8': return '后枕部毛囊';
      case '9': return '后枕部发干';
      default: return '';
    }
  };

  const getHistoryData = (selectedKey: string) => {
    if (!res || !selectedKey) return [];

    // 使用正则表达式匹配1-30的数字
    const regex = /^(?:[1-9]|[12][0-9]|30)$/;

    return Object.keys(res)
      .filter((key) => regex.test(key))
      .map((key) => ({ score: res[key][selectedKey], time: res[key].time }));
  };


  const scrollToRightSection = () => {
    if (rightSectionRef && rightSectionRef.current) {
      rightSectionRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleCardClick = (item: Item) => {
    setSelectedItem(item);
    scrollToRightSection();
    // @ts-ignore
    const key = item.his;
    const key1 = item.res;
    setImageUrls(res?.url[key1] || []);
    setHistoryData(getHistoryData(key));
  };


  useEffect(() => {
    // @ts-ignore
    const data = location.state?.data;
    // if (!data) return; // 如果data为null或undefined，则退出
    if (data == null) {
      history.push('/history')
      return;
    }
    setRes(data);
    setD1(data.duan_wei[0])
    setD2(data.duan_wei[1])
    if (!data) return; // 如果data为null或undefined，则退出

    const attributes = [
      { title: intl.formatMessage({ id: 'follicle' }), key: "follicle_score_map", res: "follicle", his: "follicle_score" },
      { title: intl.formatMessage({ id: 'hair' }), key: "hair_density_score_map", res: "hair", his: "hair_density_score" },
      { title: intl.formatMessage({ id: 'scalp_wrinkles' }), key: "hair_texture_score_map", res: "hair", his: "hair_texture_score" },
      { title: intl.formatMessage({ id: 'follicle_keratinocytes' }), key: "keratinocytes_score_map", res: "follicle_keratinocytes", his: "keratinocytes_score" },
      { title: intl.formatMessage({ id: 'scalp_oil' }), key: "scalp_oil_area_score_map", res: "scalp_oil", his: "scalp_oil_area_score" },
      { title: intl.formatMessage({ id: 'opcs_redness' }), key: "redness_area_score_map", res: "opcs_redness", his: "redness_area_score" },
      { title: intl.formatMessage({ id: 'scalp_eczema' }), key: "hair_max_rad_score_map", res: "scalp_eczema", his: "hair_max_rad_score" },
      { title: intl.formatMessage({ id: 'scurf' }), key: "scurf_area_score_map", res: "scurf", his: "scurf_area_score" },
      { title: intl.formatMessage({ id: 'white_hair' }), key: "white_ratio_score_map", res: "white_hair", his: "white_ratio_score" },
    ];

    const scoreMaps1: Item[] = attributes.map(attr => ({
      title: attr.title,
      score: data[attr.key]?.score,
      grade: intl.formatMessage({ id: data[attr.key]?.grade }),
      advice: intl.formatMessage({ id: data[attr.key]?.advice }),
      intro: intl.formatMessage({ id: data[attr.key]?.intro }),
      res: attr.res,
      his: attr.his
    }));


    setScoreMaps(scoreMaps1);
  }, [res]);

  const [, setBorderColor] = React.useState('#ccc');

  const handleShare = async () => {
    const canvas = await html2canvas(document.body); // 截取整个页面，你也可以选择截取页面的某一部分
    const image = canvas.toDataURL("image/png"); // 转换为PNG格式的data URL

    // 这里，你可以选择下载图片或者展示在某个 <img> 元素中
    const a = document.createElement("a");
    a.href = image;
    a.download = "screenshot.png";
    a.click();
  };

  const [, setIsModalVisible] = useState(false);
  const [currentKey, setCurrentKey] = useState(null);

  const showModal = (key) => {
    setCurrentKey(key);
    setIsModalVisible(true);
  };
  const showImage = (url) => {
    setSelectedImage(url);
    setIsModalVisible1(true);
  };

  const closeModal = () => {
    setIsModalVisible1(false);
  };

  function getProxiedUrl(url) {
    return `/api/proxy/image?url=${encodeURIComponent(url)}`;
  }



  return (

    <div style={{transition: 'all 0.3s'}}>
      {/*段位*/}
      {d1 && (
        <ProCard
          style={{
            backgroundImage: "url('/b1.jpg')",
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            color: 'white',
            borderRadius: '8px',
            height: '100%',
            fontWeight: 'bold',
            fontSize: '14px',
            position: 'relative',
            marginBottom: '20px',
            paddingRight: '80px'
          }}
        >
          <p>{res?.people_name}</p>
          <p className="duan-wei"><FormattedMessage id={d1} /></p>
          <p style={{fontSize: '10px'}}><FormattedMessage id={d2} /></p>
          {/* <img src="/man.svg" alt="描述" className="profile-image" /> */}
          <Button type="primary" onClick={handleShare}><FormattedMessage id="share" /></Button>
        </ProCard>
      )}
      {/*段位*/}

      {/*全节点分析 start*/}
      {selectedImageUrl && (
        <Modal
          visible={true}
          onCancel={() => setSelectedImageUrl(null)}
          footer={null}
          width="80%"
        >
          <img src={selectedImageUrl} alt="Selected" style={{ width: '100%', maxHeight: '80vh' }} />
        </Modal>
      )}

      <div className="allShow" >
        {/* 左侧：9个Card */}
        <div style={{ flex: 1, padding: '20px', borderRight: '1px solid #ccc' }}>
          {scoreMaps?.map(item => (
            <Card
              // title={item.title}
              ref={cardRef}
              onClick={() => handleCardClick(item)}
              className="list-card"
              onMouseEnter={() => setBorderColor('lightblue')}
              onMouseLeave={() => setBorderColor('#ccc')}
              style={{
                marginBottom: '25px'
              }}
            >

              <p style={{color: '#7877e6'}}>{item.title}</p>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <p>{item.score.toFixed(2)}</p>
                {item.grade == '标准' || item.grade == 'standard' ? (
                  <p className="standard-grade">{item.grade}</p>
                ) : (
                  <p className="other-grade">{item.grade}</p>
                )}
              </div>
            </Card>
          ))}
        </div>

        {/* 右侧：建议、介绍、历史数据 */}
        <div style={{ flex: 7 , display: 'flex', flexDirection: 'column', alignItems: 'stretch'}} ref={rightSectionRef}>

          {/* 上部分：selectedItem 的建议、介绍和照片 */}
          <div style={{ flex: 1 }}>
            {selectedItem && (
              <ProCard className="detail-card"
                       style={{
                         borderRadius: '8px',
                       }}
              >
                <div className="detail-content">
                  <h3>{selectedItem.title}</h3>
                  <div className="advice-section">
                    <strong><FormattedMessage id="t14" /></strong>
                    <p>{selectedItem.advice}</p>
                  </div>
                  <div className="intro-section">
                    <strong><FormattedMessage id="introduction" /></strong>
                    <p>{selectedItem.intro}</p>
                  </div>
                  <div className="images-section" style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>

                    <LeftOutlined onClick={prevImage} style={{width: '80px'}}/>
                    <img
                      src={getProxiedUrl(imageUrls[currentImageIndex])}
                      alt={selectedItem?.title}
                      className="selected-image"
                      onClick={() => handleImageClick(getProxiedUrl(imageUrls[currentImageIndex]))}
                    />
                    <RightOutlined onClick={nextImage} style={{width: '80px', marginLeft: '60px'}}/>
                  </div>
                </div>
              </ProCard>
            )}
          </div>

          {/* 下部分：历史数据 */}
          <div style={{ flex: 1 }}>
            {historyData.length > 0 && (
              <ProCard className="chart-card"
                       style={{
                         borderRadius: '8px',
                         marginTop:'20px',
                       }}
              >
                <div className="chart-card">
                  <div className="chart-title">历史检测记录</div>
                  <div className="chart-description">以下是您的历史检测分数变化。</div>
                  <TrendChart data={historyData} />

                </div>

              </ProCard>
            )}
          </div>
        </div>

      </div>
      {/*全节点分析 end*/}

      {/*节点分析 start*/}
      {isModalVisible1 && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1001  // 设置一个高的 z-index
          }}
          onClick={closeModal}
        >
          <img src={selectedImage} alt="Selected" style={{ maxHeight: '90%', maxWidth: '90%' }} />
        </div>
      )}

      <div style={{
        display: 'inline-flex', // 修改这里从 'flex' 到 'inline-flex'
        flexDirection: 'row',
        alignItems: 'stretch',
        border: '1px solid #ccc',
        borderRadius: '16px',
        // whiteSpace: 'nowrap',  // 添加这一行来防止内容换行
        marginTop: '50px'
      }}>
        <div className="allShow1" style={{ display: 'flex', height: '90vh' }}> {/* 确保容器占据整个视口高度 */}

          {/* 左侧：节点分析 */}
          <div style={{ flex: 1 }}>
            {
              pos && (
                <Card style={{ borderRadius: '8px', margin: '20px', display: 'flex', flexWrap: 'wrap' }}>
                  {Object.keys(pos).map((key) => (
                    <Button
                      key={key}
                      type="primary"
                      style={{ margin: '10px' }}
                      onClick={() => showModal(key)}
                    >
                      <FormattedMessage id={getPositionName(key)} />
                    </Button>
                  ))}
                </Card>
              )
            }
          </div>

          {/* 右侧：详细信息 */}
          <div style={{ flex: 7, overflowY: 'auto', padding: '20px' }}>
            {currentKey && (
              <div>
                <div style={{ textAlign: 'center' }}>
                  <Title level={4}><FormattedMessage id="image" /></Title>
                  <div
                    style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      justifyContent: 'center',
                      gap: '16px',
                      marginBottom: '20px'
                    }}
                  >
                    {pos[currentKey].urls.map((url: any, index: React.Key | null | undefined) => (
                      <img
                        key={index}
                        src={getProxiedUrl(url)}
                        alt={`Image ${index + 1}`}
                        width="200"
                        style={{ borderRadius: '8px' }}
                        onClick={() => showImage(getProxiedUrl(url))}
                      />
                    ))}
                  </div>
                </div>

                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>


                  <Card style={{ width: '200px', margin: '10px' }}>
                    <Text strong style={{ display: 'block', marginBottom: '10px' }}>
                      <p style={{color: "#507099"}}><FormattedMessage id="level" /> :</p> {pos[currentKey].level1}
                    </Text>
                  </Card>
                  <Card style={{ width: '200px', margin: '10px' }}>
                    <Text strong style={{ display: 'block', marginBottom: '10px' }}>
                      <FormattedMessage id="Hair follicle number" /> {pos[currentKey].follicle_count}
                    </Text>
                  </Card>
                  <Card style={{ width: '200px', margin: '10px' }}>
                    <Text strong style={{ display: 'block', marginBottom: '10px' }}>
                      <FormattedMessage id="Keratinocyte region" /> {pos[currentKey].keratinocytes_area}
                    </Text>
                  </Card>
                  <Card style={{ width: '200px', margin: '10px' }}>
                    <Text strong style={{ display: 'block', marginBottom: '10px' }}>
                      <FormattedMessage id="hairCount" />: {pos[currentKey].hair_count}
                    </Text>
                  </Card>
                  <Card style={{ width: '200px', margin: '10px' }}>
                    <Text strong style={{ display: 'block', marginBottom: '10px' }}>
                      <FormattedMessage id="rednessArea" />: {pos[currentKey].redness_area}
                    </Text>
                  </Card>

                  <Card style={{ width: '200px', margin: '10px' }}>
                    <Text strong style={{ display: 'block', marginBottom: '10px' }}>
                      <FormattedMessage id="whiteHairRatio" />: {pos[currentKey].white_hair_ratio}
                    </Text>
                  </Card>
                  <Card style={{ width: '200px', margin: '10px' }}>
                    <Text strong style={{ display: 'block', marginBottom: '10px' }}>
                      <FormattedMessage id="scalpOilArea" />: {pos[currentKey].scalp_oil_area}
                    </Text>
                  </Card>

                  <Card style={{ width: '200px', margin: '10px' }}>
                    <Text strong style={{ display: 'block', marginBottom: '10px' }}>
                      <FormattedMessage id="scurfArea" />: {pos[currentKey].scurf_area}
                    </Text>
                  </Card>


                  <Card style={{ width: '200px', margin: '10px' }}>
                    <Text strong style={{ display: 'block', marginBottom: '10px' }}>
                      <FormattedMessage id="follicleMeanRad" />: {pos[currentKey].follicle_mean_rad}
                    </Text>
                  </Card>
                  <Card style={{ width: '200px', margin: '10px' }}>
                    <Text strong style={{ display: 'block', marginBottom: '10px' }}>
                      <FormattedMessage id="hairMeanRad" />: {pos[currentKey].hair_mean_rad}
                    </Text>
                  </Card>

                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/*节点分析 end*/}
      <br/>

      {/*成分推荐*/}
      <div>
        <h2><FormattedMessage id="t13" /></h2>
        <br />
        {ingredient ? (
          Object.keys(ingredient).map((key, index) => (
            <div key={index} style={{ marginBottom: '40px' }}>
              <h3 style={{ color: '#403caa' }}>{intl.formatMessage({ id: key })}</h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
                {ingredient[key].split('\n').map((desc, descIndex) => {
                  const [title, content] = desc.split('：', 2);
                  return (
                    <Card key={descIndex} className="card-hover-effect" style={{ width: '300px', borderRadius: '25px' }}>
                      <strong>{intl.formatMessage({ id: `${title}` })}</strong>
                      <p>{intl.formatMessage({ id: `${content}` })}</p>
                    </Card>
                  );
                })}
              </div>
            </div>
          ))
        ) : (
          <p>Loading...</p>
        )}
      </div>

      {/*成分推荐end*/}

      <br/>
      {/*产品推荐*/}
      <div className="product-section">
        <h2><FormattedMessage id="t12" /></h2>
        <Row gutter={[16, 16]} className="product-row">
          {product && product.length > 0 ? (
            product.map((subArray, index) => (
              subArray.map((item, subIndex) => (
                <Col key={`${index}-${subIndex}`} xs={24} sm={12} md={8} lg={6}>
                  <Card title={item.title} className="product-card card-hover-effect">
                    <img src={item.image} alt={item.title} className="product-image" />
                    <p className="product-price"><FormattedMessage id="price" /> {item.price}</p>
                    <p className="product-recommend"><FormattedMessage id="priceLevel" /> {
                      {
                        0: <FormattedMessage id="low" />,
                        1: <FormattedMessage id="medium" />,
                        2: <FormattedMessage id="high" />
                      }[item.recommend_index]
                    }</p>
                    <p className="product-introduction"><FormattedMessage id="introduction" /> {item.introduction}</p>
                    <p className="product-description"><FormattedMessage id="description" /> {item.descriptions}</p>
                  </Card>
                </Col>
              ))
            ))
          ) : (
            <p className="no-products">No products available.</p>
          )}
        </Row>
      </div>

    </div>
  );
};
