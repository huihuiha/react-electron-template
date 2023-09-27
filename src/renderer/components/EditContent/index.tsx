import { observer } from 'mobx-react';
import sceneStore from '@renderer/store/scene';
import './index.less';
import { ModuleStyle } from '@renderer/type/task';
import modelStore from '@renderer/store/model';
import taskStore from '@renderer/store/task';
import { useEffect, useRef } from 'react';
import html2canvas from 'html2canvas';
import { batchUploadFile } from '@renderer/services/upload';
import { BATCH_UPLOAD_SCENE_CODE } from '@renderer/common/constant';
import { loadImage } from '@renderer/utils/';

const EditContent = () => {
  const containRef = useRef<HTMLDivElement>(null);

  const { modelList } = modelStore;

  const { curSceneData } = sceneStore;

  // 数字人模块
  const humanModule = curSceneData.moduleList?.find(
    (module) => module.style === ModuleStyle.Human,
  );

  // 对应的数字人
  const model = modelList.find(
    (model) => model.modelId === humanModule?.bizId,
  )!;

  // 生成封面预览图
  const handlePreview = async () => {
    const canvasDom = containRef.current!;

    const options = {
      useCORS: true, //配置允许跨域
      logging: false,
      scale: 2,
      backgroundColor: 'transparent',
    };

    try {
      await html2canvas(canvasDom, options).then(async (canvas) => {
        canvas.toBlob(async function (blob) {
          if (blob) {
            const file = new File([blob], `__preview_${taskStore.showId}.png`, {
              type: 'image/png',
            });

            const formData = new FormData();
            formData.append('sceneCode', BATCH_UPLOAD_SCENE_CODE);
            formData.append('file', file);

            const { module } = await batchUploadFile(formData);

            const { fileKey, downloadUrl } = module[0];

            Promise.all([
              // 更新封面图
              taskStore.updateShow(
                {
                  previewImgFileKey: fileKey,
                },
                false,
              ),
              // 更新场景图
              sceneStore.updateScene({
                previewImgFileKey: fileKey,
              }),
            ]).then(() => {
              sceneStore.setCurPreviewImgUrl(downloadUrl);
            });
          }
        });
      });
    } catch (err) {
      console.log('html2canvas failed', err);
    }
  };

  useEffect(() => {
    (async () => {
      if (model) {
        // 等模特显示在画布后再截图，防止截到的是旧图
        await loadImage(model.tempUrl);
        setTimeout(() => {
          handlePreview();
        }, 50);
      }
    })();
  }, [model]);

  return (
    <div className="edit-content-wrap">
      <div className="content-canvas" ref={containRef}>
        <img className="human" src={model?.tempUrl}></img>
      </div>
    </div>
  );
};

export default observer(EditContent);
