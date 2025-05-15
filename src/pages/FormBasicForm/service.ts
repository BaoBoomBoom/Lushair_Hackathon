import { request } from 'umi';

export async function fakeSubmitForm(params: any) {
  return request('/api/merchant/addProduct', {
    method: 'POST',
    data: params,
  });
}
