import { pipeline, env } from '@huggingface/transformers';

// Skip local model checks since we are running in the browser
env.allowLocalModels = false;

class PipelineFactory {
    static task: any = 'automatic-speech-recognition';
    static model = 'Xenova/whisper-tiny';
    static instance: any = null;

    static async getInstance(progress_callback: any = null) {
        if (this.instance === null) {
            this.instance = pipeline(this.task, this.model, {
                progress_callback,
                dtype: 'fp32' // Use fp32 to prevent q4/q8 ONNX MatMulNBits quantization errors
            });
        }
        return this.instance;
    }
}

self.addEventListener('message', async (event: MessageEvent) => {
    const { type, audio, language, model } = event.data;

    if (type === 'load') {
        try {
            if (model && PipelineFactory.model !== model) {
                PipelineFactory.model = model;
                PipelineFactory.instance = null; // Reset to load new model
            }
            self.postMessage({ status: 'loading_model' });
            await PipelineFactory.getInstance((data: any) => {
                self.postMessage({ status: 'download_progress', data });
            });
            self.postMessage({ status: 'ready' });
        } catch (error: any) {
            self.postMessage({ status: 'error', message: error.message });
        }
    } else if (type === 'transcribe') {
        try {
            self.postMessage({ status: 'loading_model' });
            
            if (model && PipelineFactory.model !== model) {
                PipelineFactory.model = model;
                PipelineFactory.instance = null;
            }

            const transcriber = await PipelineFactory.getInstance((data: any) => {
                self.postMessage({ status: 'download_progress', data });
            });
            
            self.postMessage({ status: 'transcribing' });

            const result = await transcriber(audio, {
                chunk_length_s: 30,
                stride_length_s: 5,
                language: language === 'auto' ? null : language,
                task: 'transcribe',
            });

            self.postMessage({ status: 'complete', result });
        } catch (error: any) {
            self.postMessage({ status: 'error', message: error.message });
        }
    }
});
