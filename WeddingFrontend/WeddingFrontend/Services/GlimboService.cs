namespace WeddingFrontend.Services
{
    public class GlimboService
    {
        public event Action<bool>? OnTrigger;
        public void Trigger(bool value) => OnTrigger?.Invoke(value);
    }
}
