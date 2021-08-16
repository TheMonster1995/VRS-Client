import react, { useState, useEffect } from 'react';
import { ScaleLoader } from 'react-spinners';
import { useHistory } from 'react-router-dom';

import repairShopApi from '../apis/repairShopApi';

const FPTempCmp = props => {
  const [loading, setLoading] = useState(true);
  const history = useHistory();

  useEffect(async () => {
    if (!loading) return;

    let token = props.match.params.token;
    let verifyToken;

    try {
      verifyToken = await repairShopApi.get(
        '/password/forgot',
        {
          headers: {
            'Content-Type': 'application/json',
            'forgottoken': token
          }
        }
      )
    } catch (err) {
      return setLoading(false);
    }

    return history.push({
      pathname: '/login',
      state: { forgotToken: verifyToken.data.payload, section: 'newp' }
    })
  }, [loading])
  return (
    <div className='w-100 text-center pt-5'>
      <h3 className='mb-4'>{loading ? 'Verifying link...' : 'Link has expired'}</h3>
      <ScaleLoader loading={loading} color='#4b93ff' height={35} width={4} radius={2} margin={2} />
    </div>
  )
}

export default FPTempCmp;
