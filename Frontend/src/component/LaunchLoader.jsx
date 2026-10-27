function LaunchLoader() {
  return (
    <section
      className="launch-loader"
      aria-label="Loading Codetech Learning Platform"
      role="status"
    >
      <div className="launch-loader__glow" aria-hidden="true" />
      <div className="launch-loader__content">
        <div className="launch-loader__mark" aria-hidden="true">
          <span>C</span>
        </div>
        <p className="launch-loader__brand">Codetech<span>.</span></p>
        <p className="launch-loader__tagline">Learn. Create. Grow.</p>
        <div className="launch-loader__progress" aria-hidden="true">
          <span />
        </div>
      </div>
    </section>
  );
}

export default LaunchLoader;
