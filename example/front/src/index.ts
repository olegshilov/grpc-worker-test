import {
  GrpcWorkerGateway,
  GrpcWorkerClient,
} from '@webworker-grpc-test/grpc-worker-client';
import { EchoRequest, EchoResponse } from '../proto/echo.pb';
import { GrpcWorkerEchoServiceClientDef } from '../proto/echo.pbwsc';
import { GrpcMetadata } from '@ngx-grpc/common';
import { tap } from 'rxjs/operators';

const worker = new Worker('./grpc.worker', { type: 'module' });
const gateway = new GrpcWorkerGateway(worker);
const clientSettings = { host: 'http://localhost:8080' };
const client = new GrpcWorkerClient(
  GrpcWorkerEchoServiceClientDef.serviceId,
  clientSettings,
  gateway,
);

async function handleEchoBtnClick() {
  console.debug('create unary request');

  const resp = client.unary(
    '/echo.EchoService/EchoOnce',
    new EchoRequest({ message: 'echo test' }),
    new GrpcMetadata(),
    EchoRequest,
    EchoResponse,
  );

  resp.pipe(tap(console.log)).subscribe();
}

async function handleStreamBtnClick() {
  console.debug('create stream request');

  const resp = client.serverStream(
    '/echo.EchoService/EchoStream',
    new EchoRequest({ message: 'stream test' }),
    new GrpcMetadata(),
    EchoRequest,
    EchoResponse,
  );

  resp.pipe(tap(console.log)).subscribe();
}

(() => {
  console.debug('example loaded');
  document
    .getElementById('echo-btn')
    ?.addEventListener('click', handleEchoBtnClick);
  document
    .getElementById('stream-btn')
    ?.addEventListener('click', handleStreamBtnClick);
})();
