/** Ilustración ornamental creada en CSS: no depende de imágenes externas. */
export default function PortalArt() {
  return <div className="portal-art" aria-hidden="true">
    <span className="portal-star portal-star-one">✧</span>
    <span className="portal-star portal-star-two">✦</span>
    <span className="portal-star portal-star-three">✧</span>
    <span className="portal-star portal-star-four">✳</span>
    <div className="portal-orbit portal-orbit-outer" />
    <div className="portal-orbit portal-orbit-inner" />
    <div className="portal-structure">
      <div className="portal-arch-outer">
        <div className="portal-arch-middle">
          <div className="portal-void">
            <div className="portal-nebula" />
            <div className="portal-horizon" />
            <div className="portal-core">✦</div>
          </div>
        </div>
      </div>
      <div className="portal-pedestal portal-pedestal-one" />
      <div className="portal-pedestal portal-pedestal-two" />
      <div className="portal-pedestal portal-pedestal-three" />
    </div>
    <span className="portal-rune portal-rune-left">✧ · ∞ · ✧</span>
    <span className="portal-rune portal-rune-right">✦ · ᚷ · ✦</span>
    <span className="portal-art-caption">AD INFINITUM · LIBER I</span>
  </div>;
}
