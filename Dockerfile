#--docker run --rm -p 8090:8080 --env-file production.env hoyvik--#
# -------------------------
# Build frontend
# -------------------------
FROM node:22 AS frontend-build

WORKDIR /frontend

COPY frontend/package*.json ./
RUN npm ci

COPY frontend/ ./

RUN npm run build


# -------------------------
# Build backend
# -------------------------
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS backend-build

WORKDIR /src

COPY backend/Hoyvik.API/Hoyvik.API.csproj ./Hoyvik.API/
COPY backend/Hoyvik.API/sixlabors.lic ./Hoyvik.API/

WORKDIR /src/Hoyvik.API

RUN dotnet restore "Hoyvik.API.csproj"

COPY backend/Hoyvik.API/ ./

# Put React production files into ASP.NET Core's wwwroot
COPY --from=frontend-build /frontend/dist ./wwwroot

RUN dotnet publish "Hoyvik.API.csproj" \
    -c Release \
    -o /app/publish


# -------------------------
# Runtime
# -------------------------
FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS final

WORKDIR /app

ENV ASPNETCORE_HTTP_PORTS=8080

COPY --from=backend-build /app/publish .

EXPOSE 8080

ENTRYPOINT ["dotnet", "Hoyvik.API.dll"]