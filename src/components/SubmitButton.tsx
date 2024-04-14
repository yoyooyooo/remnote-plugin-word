import { usePlugin } from '@remnote/plugin-sdk';
import React from 'react';
import { Loading } from '../components/Loading';

export const SubmitButton = ({
  onSubmit,
  children,
  className,
}: {
  className?: string;
  children: React.ReactNode;
  onSubmit: () => Promise<void>;
}) => {
  const plugin = usePlugin();
  const [loading, setLoading] = React.useState(false);

  return (
    <div
      className={`flex items-center cursor-pointer text-sm justify-center ${
        className ?? 'bg-pink-20 hover:bg-pink-50  text-white rounded-lg p-2'
      }`}
      onClick={async (e) => {
        setLoading(true);
        try {
          await onSubmit();
        } catch (error) {
          console.log(error);
          plugin.app.toast('执行出错');
        } finally {
          setLoading(false);
        }
      }}
    >
      {children}
      {loading && <Loading className="w-5 h-5 ml-1" />}
    </div>
  );
};
