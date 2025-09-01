const ProfileFallback = () => {
  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6 animate-pulse">
      {/* Profile Header */}
      <div>
        <div className="h-6 w-40 bg-base-200 rounded skeleton mb-2"></div>
        <div className="h-4 w-32 bg-base-200 rounded skeleton"></div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="stat bg-base-200 rounded-xl shadow flex flex-col justify-center items-center p-4">
            <div className="h-4 w-20 bg-base-300 rounded skeleton mb-2"></div>
            <div className="h-6 w-10 bg-base-300 rounded skeleton"></div>
          </div>
        ))}
      </div>

      {/* Recent Confessions */}
      <div className="space-y-3">
        <div className="h-5 w-40 bg-base-200 rounded skeleton mb-2"></div>
        <div className="space-y-2">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="card bg-base-200 shadow">
              <div className="card-body p-4">
                <div className="h-4 w-full bg-base-300 rounded skeleton"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProfileFallback;
