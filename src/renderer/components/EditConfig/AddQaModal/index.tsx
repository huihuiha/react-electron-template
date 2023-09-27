import { observer } from 'mobx-react';
import './index.less';
import {
  Button,
  Select,
  Input,
  Modal,
  Form,
  Card,
  Tag,
  Radio,
  Upload,
  message,
} from 'antd';
import type { RadioChangeEvent } from 'antd';
import { AudioOutlined, DeleteOutlined } from '@ant-design/icons';
import { useState, useEffect } from 'react';
import taskStore from '@renderer/store/task';
import { batchUploadFile } from '@renderer/services/upload';
import { BATCH_UPLOAD_SCENE_CODE } from '@renderer/common/constant';
import { TtsFileInfo } from '@renderer/type/common';

interface IProps {
  isModalOpen: boolean;
  handleCancel: () => void;
}

const MAX_COUNT = 5;
const MAX_STR = 20;

const AddQaModal: React.FC<IProps> = ({ isModalOpen, handleCancel }) => {
  const [keyword, setKeyword] = useState('');

  const handleKeywordEnter = () => {
    if (!keyword) return;
    if (taskStore.qaForm.keywordList.length >= MAX_COUNT) {
      message.error(`关键词不能超过${MAX_COUNT}个`);
      setKeyword('');
      return;
    }
    if (taskStore.qaForm.keywordList.includes(keyword)) {
      message.error('关键词不能重复');
      return;
    }
    const list = [...taskStore.qaForm.keywordList];
    list.push(keyword);
    taskStore.setQaForm({ keywordList: list });
    setKeyword('');
  };

  const handleDelKeyword = (idx: number) => {
    const list = [...taskStore.qaForm.keywordList];
    list.splice(idx, 1);
    taskStore.setQaForm({ keywordList: list });
  };

  const handleDelQa = (item: TtsFileInfo) => {
    const list = [...taskStore.qaForm.answerAudioList];
    const idx = list.findIndex((v) => v.content === item.content);
    if (idx > -1) {
      list.splice(idx, 1);
      taskStore.setQaForm({ answerAudioList: list });
    }
  };

  const onFinish = () => {
    handleKeywordEnter(); // 如果keyword有值，自动补一个关键词
    if (taskStore.qaForm.keywordList.length === 0) {
      message.error('关键词不能为空');
      return;
    }
    if (taskStore.qaForm.answerAudioList.length === 0) {
      message.error('录音话术不能为空');
      return;
    }
    taskStore.saveInteraction(taskStore.qaForm, () => {
      handleCancel();
    });
  };

  const handleUploadReq = async (file: File) => {
    try {
      const formData = new FormData();
      formData.append('sceneCode', BATCH_UPLOAD_SCENE_CODE);
      formData.append('file', file);
      const { code, msg, module } = await batchUploadFile(formData);
      if (code === 200) {
        message.success('上传成功');
        taskStore.addAudioToQaForm({
          ...module[0],
          content: module[0].fileKey,
        });
      } else {
        message.success(msg || '上传失败');
      }
    } catch {
      message.success('网络异常！');
    }
  };

  const beforeUpload = (file: File) => {
    // if (!isMp3OrM4a(file.name)) {
    //   message.error('录音只支持mp3、m4a格式的音频文件!')
    //   return false
    // }
    const isLt30M = file.size / 1024 / 1024 < 30;
    if (!isLt30M) {
      message.error('音频只支持30M以内的文件!');
      return false;
    }
    message.info('正在上传中，请稍后！');
    handleUploadReq(file);
    return false; // return false阻止组件库默认行为
  };

  useEffect(() => {
    if (!isModalOpen) {
      taskStore.resetQaForm();
    }
  }, [isModalOpen]);

  return (
    <Modal
      title="新增问答"
      open={isModalOpen}
      onCancel={handleCancel}
      footer={null}
      wrapClassName="edit-add-qa-modal"
      width={700}
    >
      <Form style={{ marginTop: 40 }} autoComplete="off">
        <Form.Item label="触发条件" required>
          <Select style={{ width: 120 }} value={1}>
            <Select.Option value={1}>关键词</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item label="关键词" required>
          <Input
            placeholder={`输入关键词，按回车新增。一个关键词最多${MAX_STR}个字符。`}
            value={keyword}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setKeyword(e.target.value);
            }}
            onPressEnter={handleKeywordEnter}
            maxLength={MAX_STR}
          />
          {taskStore.qaForm.keywordList.length > 0 && (
            <Card style={{ marginTop: 15 }}>
              {taskStore.qaForm.keywordList.map((kw, idx) => (
                <Tag
                  closeIcon
                  style={{ marginBottom: 10 }}
                  key={kw}
                  onClose={() => {
                    handleDelKeyword(idx);
                  }}
                >
                  {kw}
                </Tag>
              ))}
            </Card>
          )}
        </Form.Item>

        <Form.Item label="互动方式" required>
          <Radio.Group value={1}>
            <Radio value={1}>语音</Radio>
          </Radio.Group>
        </Form.Item>

        <Form.Item label="回复方" required>
          <Radio.Group
            value={taskStore.qaForm.answerer}
            onChange={(e: RadioChangeEvent) => {
              taskStore.setQaForm({
                answerer: e.target.value,
              });
            }}
          >
            <Radio value={0}>主播</Radio>
            <Radio value={1} disabled>
              助播
            </Radio>
          </Radio.Group>
        </Form.Item>

        <Form.Item label="打断方式" required>
          <Radio.Group value={taskStore.qaForm.interruptType}>
            <Radio value={0}>智能打断</Radio>
          </Radio.Group>
        </Form.Item>

        <Form.Item label="录音话术" required>
          <Upload
            accept=".mp3,.m4a"
            showUploadList={false}
            multiple={true}
            maxCount={10}
            beforeUpload={beforeUpload}
          >
            <div className="upload-wrap" data-add-bg>
              上传音频
            </div>
          </Upload>
          <div className="edit-qa-item-list mt-16">
            {taskStore.qaForm.answerAudioList.map((item) => (
              <div className="qa-item" key={item.content}>
                <AudioOutlined />
                <p className="qa-item-text">{item.title}</p>
                <div className="del-icon" onClick={() => handleDelQa(item)}>
                  <DeleteOutlined />
                </div>
              </div>
            ))}
          </div>
        </Form.Item>

        <Form.Item>
          <div className="flex-center">
            <Button type="primary" onClick={onFinish}>
              确定
            </Button>
          </div>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default observer(AddQaModal);
